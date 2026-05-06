import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import listingsData from "../data/listings.json";

const BEIGE = "#C8B496";
const BG = "#0a0a0a";
const SURFACE = "#141414";
const GRAY = "#6b7280";
const BORDER = "#2a2a2a";

type Listing = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  categories: string[];
  condition: string;
  featured: boolean;
  image: string;
};

const CONDITIONS = ["Like New", "Good", "Fair"] as const;

function FeaturedCard({ item, onSell }: { item: Listing; onSell: () => void }) {
  return (
    <View style={styles.featuredCard}>
      <View style={styles.featuredImage}>
        <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.saveBadge}>
          <Text style={styles.saveBadgeText}>
            Save ${(item.originalPrice - item.price).toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Text style={styles.bookmarkIcon}>🔖</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuredBody}>
        <Text style={styles.featuredTitle}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
          <Text style={styles.strikePrice}>
            ${item.originalPrice.toLocaleString()}
          </Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.condition}</Text>
          </View>
        </View>
        <View style={[styles.tagRow, { paddingRight: 140 }]}>
          {item.categories.map((cat) => (
            <View key={cat} style={styles.tag}>
              <Text style={styles.tagText}>{cat}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.sellBtn} onPress={onSell}>
        <Text style={styles.sellBtnText}>+  Sell Item</Text>
      </TouchableOpacity>
    </View>
  );
}

function ListingTile({ item }: { item: Listing }) {
  return (
    <TouchableOpacity style={styles.tile}>
      <Image source={{ uri: item.image }} style={styles.tileImage} resizeMode="cover" />
      <View style={styles.tileBody}>
        <Text style={styles.tileName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.tilePriceRow}>
          <Text style={styles.tilePrice}>${item.price.toLocaleString()}</Text>
          <Text style={styles.tileStrikePrice}>
            ${item.originalPrice.toLocaleString()}
          </Text>
        </View>
        <Text style={styles.tileDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.tileTagRow}>
          {item.categories.slice(0, 2).map((cat) => (
            <View key={cat} style={styles.tileTag}>
              <Text style={styles.tileTagText}>{cat}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const [allListings, setAllListings] = useState<Listing[]>(listingsData as Listing[]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sellVisible, setSellVisible] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<string>("Good");
  const [categories, setCategories] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const allTags = Array.from(new Set(allListings.flatMap((l) => l.categories)));

  const filtered = selectedTag
    ? allListings.filter((l) => l.categories.includes(selectedTag))
    : allListings;

  const featuredListing = filtered.find((l) => l.featured);
  const otherListings = filtered.filter((l) => !l.featured);

  function resetForm() {
    setName("");
    setPrice("");
    setOriginalPrice("");
    setDescription("");
    setCondition("Good");
    setCategories("");
    setImageUrl("");
  }

  function handleSell() {
    if (!name.trim() || !price.trim()) return;
    const parsedCats = categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => (c.startsWith("#") ? c : `#${c}`));

    const newListing: Listing = {
      id: Date.now().toString(),
      name: name.trim(),
      price: parseFloat(price) || 0,
      originalPrice: parseFloat(originalPrice) || parseFloat(price) || 0,
      description: description.trim(),
      condition,
      categories: parsedCats,
      featured: false,
      image:
        imageUrl.trim() ||
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80",
    };

    setAllListings((prev) => [newListing, ...prev]);
    resetForm();
    setSellVisible(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Marketplace</Text>
          <TouchableOpacity onPress={() => setSellVisible(true)}>
            <Text style={styles.headerIcon}>⊡</Text>
          </TouchableOpacity>
        </View>

        {/* Hashtag filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagScroll}
          style={styles.tagScrollWrap}
        >
          <TouchableOpacity
            style={[styles.filterTag, !selectedTag && styles.filterTagActive]}
            onPress={() => setSelectedTag(null)}
          >
            <Text style={[styles.filterTagText, !selectedTag && styles.filterTagTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {allTags.map((tag) => {
            const active = selectedTag === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.filterTag, active && styles.filterTagActive]}
                onPress={() => setSelectedTag(active ? null : tag)}
              >
                <Text style={[styles.filterTagText, active && styles.filterTagTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Listing */}
        {featuredListing ? (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionIcon}>↗</Text>
              <Text style={styles.sectionLabel}> Featured Listing</Text>
            </View>
            <FeaturedCard item={featuredListing} onSell={() => setSellVisible(true)} />
          </>
        ) : null}

        {/* All Listings */}
        {otherListings.length > 0 ? (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel2}>
                {selectedTag ? `${selectedTag}` : "All Listings"}
              </Text>
            </View>
            {otherListings.map((item) => (
              <ListingTile key={item.id} item={item} />
            ))}
          </>
        ) : (
          <Text style={styles.emptyText}>No listings for {selectedTag}</Text>
        )}
      </ScrollView>

      {/* Sell Item Modal */}
      <Modal visible={sellVisible} animationType="slide" transparent statusBarTranslucent>
        <Pressable style={styles.overlay} onPress={() => setSellVisible(false)}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.sheetHandle} />

                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Sell an Item</Text>
                  <TouchableOpacity onPress={() => setSellVisible(false)}>
                    <Text style={styles.sheetClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Item Name *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Akrapovic Exhaust"
                  placeholderTextColor={GRAY}
                />

                <View style={styles.priceInputRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Asking Price *</Text>
                    <TextInput
                      style={styles.input}
                      value={price}
                      onChangeText={setPrice}
                      placeholder="$0"
                      placeholderTextColor={GRAY}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Original Price</Text>
                    <TextInput
                      style={styles.input}
                      value={originalPrice}
                      onChangeText={setOriginalPrice}
                      placeholder="$0"
                      placeholderTextColor={GRAY}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your item..."
                  placeholderTextColor={GRAY}
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.inputLabel}>Condition</Text>
                <View style={styles.conditionRow}>
                  {CONDITIONS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.conditionBtn, condition === c && styles.conditionBtnActive]}
                      onPress={() => setCondition(c)}
                    >
                      <Text
                        style={[
                          styles.conditionBtnText,
                          condition === c && styles.conditionBtnTextActive,
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Categories</Text>
                <TextInput
                  style={styles.input}
                  value={categories}
                  onChangeText={setCategories}
                  placeholder="performance, bmw, exhaust"
                  placeholderTextColor={GRAY}
                  autoCapitalize="none"
                />
                <Text style={styles.inputHint}>Comma-separated — # added automatically</Text>

                <Text style={styles.inputLabel}>Image URL</Text>
                <TextInput
                  style={styles.input}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder="https://..."
                  placeholderTextColor={GRAY}
                  autoCapitalize="none"
                  keyboardType="url"
                />
                <Text style={styles.inputHint}>Leave blank to use a placeholder</Text>

                <TouchableOpacity
                  style={[styles.submitBtn, (!name.trim() || !price.trim()) && styles.submitBtnDisabled]}
                  onPress={handleSell}
                  disabled={!name.trim() || !price.trim()}
                >
                  <Text style={styles.submitBtnText}>List Item</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
  },
  headerIcon: {
    color: "white",
    fontSize: 24,
  },

  // Hashtag filter row
  tagScrollWrap: {
    marginBottom: 20,
  },
  tagScroll: {
    gap: 8,
    paddingRight: 20,
  },
  filterTag: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterTagActive: {
    backgroundColor: BEIGE,
    borderColor: BEIGE,
  },
  filterTagText: {
    color: GRAY,
    fontSize: 13,
    fontWeight: "500",
  },
  filterTagTextActive: {
    color: "#1a1a1a",
    fontWeight: "700",
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    color: BEIGE,
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionLabel: {
    color: BEIGE,
    fontSize: 16,
    fontWeight: "600",
  },
  sectionLabel2: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  emptyText: {
    color: GRAY,
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },

  // Featured card
  featuredCard: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 28,
  },
  featuredImage: {
    height: 220,
    backgroundColor: "#2c2c2c",
  },
  saveBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: BEIGE,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  saveBadgeText: {
    color: "#1a1a1a",
    fontWeight: "bold",
    fontSize: 13,
  },
  bookmarkBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    padding: 8,
  },
  bookmarkIcon: {
    fontSize: 16,
  },
  featuredBody: {
    padding: 16,
    paddingBottom: 70,
  },
  featuredTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  price: {
    color: BEIGE,
    fontSize: 30,
    fontWeight: "bold",
  },
  strikePrice: {
    color: GRAY,
    fontSize: 18,
    textDecorationLine: "line-through",
  },
  description: {
    color: GRAY,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: {
    color: "white",
    fontSize: 13,
  },
  sellBtn: {
    position: "absolute",
    bottom: 18,
    right: 16,
    backgroundColor: BEIGE,
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  sellBtnText: {
    color: "#1a1a1a",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Listing tile
  tile: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
    flexDirection: "row",
  },
  tileImage: {
    width: 110,
    height: 130,
    backgroundColor: "#2c2c2c",
  },
  tileBody: {
    flex: 1,
    padding: 12,
  },
  tileName: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tilePriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  tilePrice: {
    color: BEIGE,
    fontSize: 17,
    fontWeight: "bold",
  },
  tileStrikePrice: {
    color: GRAY,
    fontSize: 13,
    textDecorationLine: "line-through",
  },
  tileDescription: {
    color: GRAY,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  tileTagRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  tileTag: {
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tileTagText: {
    color: GRAY,
    fontSize: 11,
  },

  // Sell modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#111111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "90%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sheetTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  sheetClose: {
    color: GRAY,
    fontSize: 18,
    padding: 4,
  },
  inputLabel: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "white",
    fontSize: 15,
    marginBottom: 16,
  },
  inputMultiline: {
    height: 90,
    textAlignVertical: "top",
  },
  inputHint: {
    color: GRAY,
    fontSize: 11,
    marginTop: -12,
    marginBottom: 16,
  },
  priceInputRow: {
    flexDirection: "row",
  },
  conditionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  conditionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  conditionBtnActive: {
    backgroundColor: BEIGE,
    borderColor: BEIGE,
  },
  conditionBtnText: {
    color: GRAY,
    fontSize: 13,
    fontWeight: "500",
  },
  conditionBtnTextActive: {
    color: "#1a1a1a",
    fontWeight: "700",
  },
  submitBtn: {
    backgroundColor: BEIGE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    color: "#1a1a1a",
    fontWeight: "bold",
    fontSize: 16,
  },
});

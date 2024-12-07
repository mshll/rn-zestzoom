import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image, FlatList, Pressable } from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useState, useMemo } from 'react';
import restaurants from '../data/restaurants';
import restaurantCategories from '../data/categories';
import { recentOrders } from '../data/recentOrders';
import dishesBetterImages from '../data/dishesBetterImages';

const QuickSearchItem = ({ icon, label, count, onPress }) => (
  <TouchableOpacity style={styles.quickSearchItem} onPress={onPress}>
    <View style={styles.quickSearchIconContainer}>
      <Icon name={icon} size={24} color="#485c48" />
      {count && <Text style={styles.quickSearchCount}>{count}</Text>}
    </View>
    <Text style={styles.quickSearchLabel}>{label}</Text>
  </TouchableOpacity>
);

const PopularDish = ({ item, onPress }) => (
  <TouchableOpacity style={styles.popularDishItem} onPress={onPress}>
    <View style={styles.popularDishImageContainer}>
      <Image source={dishesBetterImages[item.name] || { uri: item.image }} style={styles.popularDishImage} />
    </View>
    <View style={styles.popularDishContent}>
      <Text style={styles.popularDishName}>{item.name}</Text>
      <Text style={styles.popularDishPrice}>{item.price} KWD</Text>
    </View>
  </TouchableOpacity>
);

const Explore = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Get all menu items from all restaurants
  const allMenuItems = useMemo(() => {
    return restaurants.flatMap((restaurant) =>
      restaurant.menuItems.map((item) => ({
        ...item,
        restaurantName: restaurant.name,
        restaurantId: restaurant.id,
      }))
    );
  }, []);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results = [];

    // Search in restaurants
    restaurants.forEach((restaurant) => {
      if (restaurant.name.toLowerCase().includes(query) || restaurant.category.toLowerCase().includes(query)) {
        results.push({
          type: 'restaurant',
          item: restaurant,
        });
      }

      // Search in menu items
      restaurant.menuItems.forEach((item) => {
        if (item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) {
          results.push({
            type: 'menuItem',
            item: { ...item, restaurantName: restaurant.name, restaurantId: restaurant.id },
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

  // Get popular dishes (using menu items from highly rated restaurants)
  const popularDishes = useMemo(() => {
    const topRestaurants = restaurants.filter((r) => r.rating >= 4.5).slice(0, 3);
    return topRestaurants
      .flatMap((r) =>
        r.menuItems.map((item) => ({
          ...item,
          restaurantName: r.name,
          restaurantId: r.id,
        }))
      )
      .slice(0, 6);
  }, []);

  const quickSearchCategories = [
    {
      icon: 'utensils',
      label: 'Cuisines',
      count: restaurantCategories.length,
    },
    {
      icon: 'clock-rotate-left',
      label: 'Recent',
      count: recentOrders.length,
    },
    {
      icon: 'star',
      label: 'Top Rated',
      count: restaurants.filter((r) => r.rating >= 4.5).length,
    },
    {
      icon: 'bolt',
      label: 'Fast Delivery',
      count: restaurants.filter((r) => r.deliveryTime.split('-')[0] <= 25).length,
    },
  ];

  const renderSearchResult = ({ item }) => {
    if (item.type === 'menuItem') {
      return (
        <TouchableOpacity
          style={styles.searchResultItem}
          onPress={() =>
            navigation.navigate('MenuItemDetail', {
              menuItem: item.item,
              restaurantId: item.item.restaurantId,
            })
          }
        >
          <Image source={dishesBetterImages[item.item.name] || { uri: item.item.image }} style={styles.searchResultImage} />
          <View style={styles.searchResultContent}>
            <Text style={styles.searchResultTitle}>{item.item.name}</Text>
            <Text style={styles.searchResultSubtitle}>From {item.item.restaurantName}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.searchResultItem} onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item.item })}>
        <Image source={{ uri: item.item.image }} style={styles.searchResultImage} />
        <View style={styles.searchResultContent}>
          <Text style={styles.searchResultTitle}>{item.item.name}</Text>
          <Text style={styles.searchResultSubtitle}>{item.item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <CustomStatusBar statusBgColor="#d3e8d6" bgColor="#1b1d21">
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <Icon name="magnifying-glass" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search restaurants, dishes, cuisines..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="xmark" size={20} color="#666" style={styles.clearIcon} />
                </TouchableOpacity>
              )}
            </View>
            <Pressable style={styles.mapButton} onPress={() => navigation.navigate('Map')}>
              <Icon name="map-location-dot" size={16} color="#d3e8d6" />
            </Pressable>
          </View>
        </View>

        {searchQuery ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => `${item.type}-${item.item.id}-${index}`}
            contentContainerStyle={styles.searchResults}
            renderItem={renderSearchResult}
          />
        ) : (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.quickSearchContainer}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
              <View style={styles.quickSearchGrid}>
                {quickSearchCategories.map((item, index) => (
                  <QuickSearchItem key={index} {...item} />
                ))}
              </View>
            </View>

            <View style={styles.popularDishesContainer}>
              <Text style={styles.sectionTitle}>Popular Dishes</Text>
              <View style={styles.popularDishesWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularDishesScroll}>
                  {popularDishes.map((item, index) => (
                    <PopularDish
                      key={index}
                      item={item}
                      onPress={() =>
                        navigation.navigate('MenuItemDetail', {
                          menuItem: item,
                          restaurantId: item.restaurantId,
                        })
                      }
                    />
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.topRatedContainer}>
              <Text style={styles.sectionTitle}>Top Rated Restaurants</Text>
              {restaurants
                .filter((r) => r.rating >= 4.5)
                .slice(0, 3)
                .map((restaurant, index) => (
                  <TouchableOpacity key={index} style={styles.topRatedItem} onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}>
                    <Image source={{ uri: restaurant.image }} style={styles.topRatedImage} />
                    <View style={styles.topRatedContent}>
                      <Text style={styles.topRatedTitle}>{restaurant.name}</Text>
                      <Text style={styles.topRatedCategory}>{restaurant.category}</Text>
                      <View style={styles.ratingContainer}>
                        <Icon name="star" solid size={16} color="#d3e8d6" />
                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                        <Text style={styles.deliveryTime}> • {restaurant.deliveryTime}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        )}
      </View>
    </CustomStatusBar>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1d21',
  },
  searchContainer: {
    backgroundColor: '#d3e8d6',
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1d21',
    borderRadius: 25,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    color: '#d3e8d6',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#d3e8d6',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  quickSearchContainer: {
    marginBottom: 24,
  },
  quickSearchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  quickSearchItem: {
    width: '50%',
    padding: 8,
  },
  quickSearchIconContainer: {
    backgroundColor: '#d3e8d6',
    borderRadius: 16,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  quickSearchCount: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#485c48',
    color: '#d3e8d6',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  quickSearchLabel: {
    color: '#d3e8d6',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
    marginTop: 8,
  },
  popularDishesContainer: {
    marginBottom: 24,
  },
  popularDishesWrapper: {
    height: 200,
    overflow: 'hidden',
  },
  popularDishesScroll: {
    paddingHorizontal: 16,
  },
  popularDishItem: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#222429',
    borderRadius: 10,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: '#282a2f',
    marginTop: 50,
  },
  popularDishImageContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: -40,
  },
  popularDishImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  popularDishContent: {
    padding: 12,
    backgroundColor: '#222429',
    borderRadius: 10,
  },
  popularDishName: {
    color: '#d3e8d6',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  popularDishPrice: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  topRatedContainer: {
    paddingBottom: 24,
  },
  topRatedItem: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#222429',
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 100,
    borderWidth: 1,
    borderColor: '#282a2f',
  },
  topRatedImage: {
    width: 100,
    height: '100%',
  },
  topRatedContent: {
    flex: 1,
    padding: 12,
  },
  topRatedTitle: {
    color: '#d3e8d6',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  topRatedCategory: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#d3e8d6',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 4,
  },
  deliveryTime: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  searchResults: {
    padding: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    backgroundColor: '#222429',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#282a2f',
    height: 100,
  },
  searchResultImage: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
  },
  searchResultContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  searchResultTitle: {
    color: '#d3e8d6',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  searchResultSubtitle: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  mapButton: {
    width: 40,
    height: 40,
    backgroundColor: '#222429',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

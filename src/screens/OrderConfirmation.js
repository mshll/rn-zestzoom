import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dishesBetterImages from '../data/dishesBetterImages';

const OrderItem = ({ item }) => (
  <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} style={styles.itemContainer}>
    <Image source={dishesBetterImages[item.name] || { uri: item.image }} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price} KWD</Text>
    </View>
    <View style={styles.quantityContainer}>
      <Text style={styles.quantity}>x{item.quantity}</Text>
    </View>
  </MotiView>
);

const OrderConfirmation = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { orderTotal, items, restaurantName, restaurantImage, orderDate, orderId } = route.params;

  return (
    <CustomStatusBar statusBgColor="#1b1d21" bgColor="#1b1d21">
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.popToTop()}>
          <Icon name="xmark" size={20} color="#d3e8d6" />
        </TouchableOpacity>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name="circle-check" size={80} color="#f9ffb7" solid />
            </View>
            <Text style={styles.title}>Order Confirmed!</Text>
            <Text style={styles.message}>Your order has been successfully placed</Text>
          </MotiView>

          <View style={styles.content}>
            <View style={styles.orderInfoCard}>
              <View style={styles.orderInfoRow}>
                <View style={styles.orderInfoItem}>
                  <Text style={styles.orderInfoLabel}>Order ID</Text>
                  <Text style={styles.orderInfoValue}>#{orderId.toString().slice(-6)}</Text>
                </View>
                <View style={styles.orderInfoItem}>
                  <Text style={styles.orderInfoLabel}>Date</Text>
                  <Text style={styles.orderInfoValue}>{format(new Date(orderDate), 'MMM d, h:mm a')}</Text>
                </View>
              </View>
            </View>

            <View style={styles.restaurantCard}>
              <Image source={{ uri: restaurantImage }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurantName}</Text>
                <Text style={styles.orderStatus}>Preparing your order</Text>
              </View>
            </View>

            <View style={styles.itemsCard}>
              <Text style={styles.sectionTitle}>Order Details</Text>
              {items.map((item, index) => (
                <OrderItem key={index} item={item} />
              ))}

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>{orderTotal} KWD</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 500 }}
          style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}
        >
          <Button onPress={() => navigation.popToTop()}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </Button>
        </MotiView>
      </View>
    </CustomStatusBar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1d21',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#222429',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    color: '#f9ffb7',
    fontFamily: 'Poppins_700Bold',
  },
  message: {
    fontSize: 16,
    color: '#d3e8d6',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  orderInfoCard: {
    backgroundColor: '#222429',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#282a2f',
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderInfoItem: {
    gap: 4,
  },
  orderInfoLabel: {
    fontSize: 12,
    color: '#797b89',
    fontFamily: 'Poppins_500Medium',
  },
  orderInfoValue: {
    fontSize: 14,
    color: '#d3e8d6',
    fontFamily: 'Poppins_600SemiBold',
  },
  restaurantCard: {
    backgroundColor: '#222429',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#282a2f',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  restaurantInfo: {
    flex: 1,
    gap: 4,
  },
  restaurantName: {
    fontSize: 18,
    color: '#d3e8d6',
    fontFamily: 'Poppins_600SemiBold',
  },
  orderStatus: {
    fontSize: 14,
    color: '#f9ffb7',
    fontFamily: 'Poppins_500Medium',
  },
  itemsCard: {
    backgroundColor: '#222429',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#282a2f',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#d3e8d6',
    fontFamily: 'Poppins_600SemiBold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1d21',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    color: '#d3e8d6',
    fontFamily: 'Poppins_600SemiBold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#797b89',
    fontFamily: 'Poppins_500Medium',
  },
  quantityContainer: {
    backgroundColor: '#222429',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quantity: {
    fontSize: 14,
    color: '#d3e8d6',
    fontFamily: 'Poppins_600SemiBold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#282a2f',
  },
  totalLabel: {
    fontSize: 16,
    color: '#d3e8d6',
    fontFamily: 'Poppins_600SemiBold',
  },
  totalAmount: {
    fontSize: 20,
    color: '#d3e8d6',
    fontFamily: 'Poppins_700Bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#282a2f',
  },
  buttonText: {
    color: '#1b1d21',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default OrderConfirmation;

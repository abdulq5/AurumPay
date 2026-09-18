import {
  Stack,
  useRouter,
} from 'expo-router';

import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useMemo,
  useState,
} from 'react';

import {
  useWallet,
} from '../context/WalletContext';

import {
  redemptionProducts,
} from '../src/redemption/redemptionProducts';

import {
  RedemptionCategory,
  RedemptionProduct,
} from '../../types/redemption';
import { colors } from '../src/theme/colors';
import { formatMoney } from '../src/utils/format';

const { gold, navy, pageBackground } = colors;


type CatalogueFilter =
  | 'ALL'
  | RedemptionCategory;


/*
 * Product image mapping.
 *
 * The key must match the product id
 * from redemptionProducts.ts.
 */

const productImages:
  Record<
    string,
    ImageSourcePropType
  > = {

    'coin-1g':
      require(
        '../assets/products/coin-1g.png'
      ),

    'coin-5g':
      require(
        '../assets/products/coin-5g.png'
      ),

    'coin-10g':
      require(
        '../assets/products/coin-10g.png'
      ),

    'bar-5g':
      require(
        '../assets/products/gold-bar-5g.png'
      ),

    'bar-10g':
      require(
        '../assets/products/gold-bar-10g.png'
      ),

    'bar-20g':
      require(
        '../assets/products/gold-bar-20g.png'
      ),

    'ring-classic':
      require(
        '../assets/products/ring-classic.png'
      ),

    'chain-classic':
      require(
        '../assets/products/chain-classic.png'
      ),

    'necklace-stone':
      require(
        '../assets/products/necklace-stone.png'
      ),

  };


export default function RedeemScreen() {


  const router =
    useRouter();


  const {
    goldBalance,
  } = useWallet();


  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState<
    CatalogueFilter
  >(
    'ALL'
  );


  /*
   * Filter catalogue according
   * to the selected category.
   */

  const visibleProducts =
    useMemo(
      () => {

        if (
          selectedFilter ===
          'ALL'
        ) {

          return redemptionProducts;

        }


        return redemptionProducts.filter(
          product =>
            product.category ===
            selectedFilter
        );

      },
      [
        selectedFilter,
      ]
    );



  /*
   * Navigate to the product
   * details screen.
   */

  function handleProductPress(
    product: RedemptionProduct
  ) {

    router.push({
      pathname:
        '/product-details',

      params: {
        productId:
          product.id,
      },
    });

  }


  /*
   * Get category label.
   */

  function getCategoryLabel(
    category:
      RedemptionCategory
  ) {

    if (
      category ===
      'COIN'
    ) {

      return 'Gold Coin';

    }


    if (
      category ===
      'BAR'
    ) {

      return 'Gold Bar';

    }


    return 'Jewellery';

  }


  /*
   * Calculate the customer's
   * current wallet value using
   * the current demo redemption
   * rate used in the catalogue.
   */

  const displayRedemptionRate =
    6320;


  const walletGoldValue =
    goldBalance *
    displayRedemptionRate;


  return (

    <View
      style={s.page}
    >


      <Stack.Screen
        options={{
          headerShown: true,

          title:
            'Redeem Gold',

          headerStyle: {
            backgroundColor:
              pageBackground,
          },

          headerShadowVisible:
            false,
        }}
      />


      <ScrollView
        contentContainerStyle={
          s.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >


        {/* PAGE HEADER */}

        <Text
          style={s.title}
        >
          Redeem your gold
        </Text>


        <Text
          style={s.subtitle}
        >
          Use your AurumPay digital
          gold toward physical gold
          products and jewellery.
        </Text>


        {/* WALLET CARD */}

        <View
          style={s.walletCard}
        >

          <Text
            style={s.walletLabel}
          >
            YOUR DIGITAL GOLD
          </Text>


          <Text
            style={s.walletGold}
          >
            {goldBalance.toFixed(
              4
            )}
            {' g'}
          </Text>


          <View
            style={s.walletDivider}
          />


          <View
            style={s.walletValueRow}
          >

            <Text
              style={s.walletValueLabel}
            >
              Estimated redemption value
            </Text>


            <Text
              style={s.walletValue}
            >
              ₹
              {formatMoney(
                walletGoldValue
              )}
            </Text>

          </View>


          <Text
            style={s.walletRateText}
          >
            Demo redemption rate:
            {' '}
            ₹
            {formatMoney(
              displayRedemptionRate
            )}
            {' / g'}
          </Text>

        </View>


        {/* SECTION HEADER */}

        <View
          style={s.sectionHeader}
        >

          <Text
            style={s.sectionTitle}
          >
            Redemption catalogue
          </Text>


          <Text
            style={s.productCount}
          >
            {visibleProducts.length}
            {' '}
            products
          </Text>

        </View>


        {/* CATEGORY FILTER */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            s.filterContainer
          }
        >


          <TouchableOpacity
            style={[
              s.filterButton,

              selectedFilter ===
              'ALL'

                ? s.filterButtonActive

                : null,
            ]}
            onPress={() =>
              setSelectedFilter(
                'ALL'
              )
            }
          >

            <Text
              style={[
                s.filterText,

                selectedFilter ===
                'ALL'

                  ? s.filterTextActive

                  : null,
              ]}
            >
              All
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={[
              s.filterButton,

              selectedFilter ===
              'COIN'

                ? s.filterButtonActive

                : null,
            ]}
            onPress={() =>
              setSelectedFilter(
                'COIN'
              )
            }
          >

            <Text
              style={[
                s.filterText,

                selectedFilter ===
                'COIN'

                  ? s.filterTextActive

                  : null,
              ]}
            >
              Coins
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={[
              s.filterButton,

              selectedFilter ===
              'BAR'

                ? s.filterButtonActive

                : null,
            ]}
            onPress={() =>
              setSelectedFilter(
                'BAR'
              )
            }
          >

            <Text
              style={[
                s.filterText,

                selectedFilter ===
                'BAR'

                  ? s.filterTextActive

                  : null,
              ]}
            >
              Bars
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={[
              s.filterButton,

              selectedFilter ===
              'JEWELLERY'

                ? s.filterButtonActive

                : null,
            ]}
            onPress={() =>
              setSelectedFilter(
                'JEWELLERY'
              )
            }
          >

            <Text
              style={[
                s.filterText,

                selectedFilter ===
                'JEWELLERY'

                  ? s.filterTextActive

                  : null,
              ]}
            >
              Jewellery
            </Text>

          </TouchableOpacity>

        </ScrollView>


        {/* PRODUCT LIST */}

        {
          visibleProducts.map(
            product => (

              <TouchableOpacity
                key={
                  product.id
                }
                activeOpacity={
                  0.8
                }
                style={
                  s.productCard
                }
                onPress={() =>
                  handleProductPress(
                    product
                  )
                }
              >


                {/* PRODUCT IMAGE */}

                <View
                  style={
                    s.productImageContainer
                  }
                >

                  <Image
                    source={
                      productImages[
                        product.id
                      ]
                    }
                    style={
                      s.productImage
                    }
                    resizeMode={
                      'contain'
                    }
                  />

                </View>


                {/* CATEGORY */}

                <View
                  style={
                    s.categoryBadge
                  }
                >

                  <Text
                    style={
                      s.categoryBadgeText
                    }
                  >
                    {
                      getCategoryLabel(
                        product.category
                      )
                    }
                  </Text>

                </View>


                {/* PRODUCT NAME */}

                <Text
                  style={
                    s.productName
                  }
                >
                  {product.name}
                </Text>


                {/* DESCRIPTION */}

                <Text
                  style={
                    s.productDescription
                  }
                  numberOfLines={
                    2
                  }
                >
                  {
                    product.description
                  }
                </Text>


                {/* PRODUCT INFORMATION */}

                <View
                  style={
                    s.productInfoRow
                  }
                >

                  <View
                    style={
                      s.productInfoItem
                    }
                  >

                    <Text
                      style={
                        s.productInfoLabel
                      }
                    >
                      Purity
                    </Text>


                    <Text
                      style={
                        s.productInfoValue
                      }
                    >
                      {
                        product.purity ??
                        '—'
                      }
                    </Text>

                  </View>


                  <View
                    style={
                      s.productInfoItem
                    }
                  >

                    <Text
                      style={
                        s.productInfoLabel
                      }
                    >
                      Net Gold
                    </Text>


                    <Text
                      style={
                        s.productInfoValue
                      }
                    >
                      {
                        (
                          product.netGoldWeight ??
                          product.goldWeight
                        ).toFixed(
                          2
                        )
                      }
                      {' g'}
                    </Text>

                  </View>


                  <View
                    style={
                      s.productInfoItem
                    }
                  >

                    <Text
                      style={
                        s.productInfoLabel
                      }
                    >
                      Gold Content
                    </Text>


                    <Text
                      style={
                        s.productInfoValue
                      }
                      numberOfLines={
                        1
                      }
                    >
                      {
                        product.goldContent ??
                        '—'
                      }
                    </Text>

                  </View>

                </View>


                {/* DIVIDER */}

                <View
                  style={
                    s.productDivider
                  }
                />


                {/* PRICE */}

                <View
                  style={
                    s.productBottomRow
                  }
                >

                  <View>

                    <Text
                      style={
                        s.priceLabel
                      }
                    >
                      Total product value
                    </Text>


                    <Text
                      style={
                        s.productPrice
                      }
                    >
                      ₹
                      {
                        formatMoney(
                          product.totalAmount
                        )
                      }
                    </Text>

                  </View>


                  <View
                    style={
                      s.viewDetailsContainer
                    }
                  >

                    <Text
                      style={
                        s.viewDetailsText
                      }
                    >
                      View details
                    </Text>


                    <Text
                      style={
                        s.arrowText
                      }
                    >
                      ›
                    </Text>

                  </View>

                </View>

              </TouchableOpacity>

            )
          )
        }


        {/* EMPTY STATE */}

        {
          visibleProducts.length ===
          0

            ? (

              <View
                style={
                  s.emptyState
                }
              >

                <Text
                  style={
                    s.emptyTitle
                  }
                >
                  No products found
                </Text>


                <Text
                  style={
                    s.emptyText
                  }
                >
                  There are currently no
                  products available in
                  this category.
                </Text>

              </View>

            )

            : null
        }


        {/* INFORMATION */}

        <View
          style={
            s.infoCard
          }
        >

          <Text
            style={
              s.infoTitle
            }
          >
            How redemption works
          </Text>


          <Text
            style={
              s.infoText
            }
          >
            Select a product, review its
            complete invoice and choose
            how your digital gold should
            be applied. If any amount
            remains after gold redemption,
            you will be asked to complete
            the remaining payment.
          </Text>

        </View>


        {/* DISCLAIMER */}

        <Text
          style={
            s.disclaimer
          }
        >
          Product availability, pricing,
          taxes, gold rates and delivery
          terms shown here are for the
          current AurumPay demonstration
          flow.
        </Text>


      </ScrollView>

    </View>

  );

}


const s =
  StyleSheet.create({


    page: {
      flex: 1,

      backgroundColor:
        pageBackground,
    },


    content: {
      padding: 20,

      paddingBottom: 40,
    },


    /*
     * PAGE HEADER
     */

    title: {
      marginTop: 8,

      fontSize: 28,

      fontWeight: '800',

      color: navy,
    },


    subtitle: {
      marginTop: 8,

      fontSize: 15,

      lineHeight: 22,

      color:
        '#667085',
    },


    /*
     * WALLET
     */

    walletCard: {
      marginTop: 24,

      backgroundColor:
        navy,

      borderRadius: 22,

      padding: 22,
    },


    walletLabel: {
      fontSize: 11,

      fontWeight: '800',

      letterSpacing: 1,

      color:
        '#BFC8D3',
    },


    walletGold: {
      marginTop: 10,

      fontSize: 30,

      fontWeight: '800',

      color:
        '#FFFFFF',
    },


    walletDivider: {
      height: 1,

      marginVertical: 18,

      backgroundColor:
        '#304357',
    },


    walletValueRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',
    },


    walletValueLabel: {
      fontSize: 13,

      color:
        '#BFC8D3',
    },


    walletValue: {
      fontSize: 16,

      fontWeight: '800',

      color:
        '#FFFFFF',
    },


    walletRateText: {
      marginTop: 10,

      fontSize: 11,

      color:
        '#BFC8D3',
    },


    /*
     * SECTION
     */

    sectionHeader: {
      marginTop: 28,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',
    },


    sectionTitle: {
      fontSize: 20,

      fontWeight: '800',

      color: navy,
    },


    productCount: {
      fontSize: 13,

      color:
        '#667085',
    },


    /*
     * FILTERS
     */

    filterContainer: {
      paddingTop: 16,

      paddingBottom: 8,

      gap: 10,
    },


    filterButton: {
      height: 40,

      paddingHorizontal: 18,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#D0D5DD',

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    filterButtonActive: {
      borderColor: gold,

      backgroundColor:
        gold,
    },


    filterText: {
      fontSize: 14,

      fontWeight: '700',

      color: navy,
    },


    filterTextActive: {
      color: navy,
    },


    /*
     * PRODUCT CARD
     */

    productCard: {
      marginTop: 14,

      backgroundColor:
        '#FFFFFF',

      borderRadius: 20,

      padding: 20,

      borderWidth: 1,

      borderColor:
        '#E7E9EC',
    },


    /*
     * PRODUCT IMAGE
     */

    productImageContainer: {
      height: 180,

      width: '100%',

      borderRadius: 16,

      overflow:
        'hidden',

      justifyContent:
        'center',

      alignItems:
        'center',

      backgroundColor:
        '#F8F5EE',

      marginBottom: 16,
    },


    productImage: {
      width: '100%',

      height: '100%',
    },


    /*
     * CATEGORY
     */

    categoryBadge: {
      alignSelf:
        'flex-start',

      paddingHorizontal: 10,

      paddingVertical: 5,

      borderRadius: 10,

      backgroundColor:
        '#FFF5D6',
    },


    categoryBadgeText: {
      fontSize: 10,

      fontWeight: '800',

      letterSpacing: 0.5,

      color:
        '#8B6A1C',
    },


    productName: {
      marginTop: 14,

      fontSize: 19,

      fontWeight: '800',

      color: navy,
    },


    productDescription: {
      marginTop: 7,

      fontSize: 13,

      lineHeight: 19,

      color:
        '#667085',
    },


    productInfoRow: {
      marginTop: 18,

      flexDirection:
        'row',

      justifyContent:
        'space-between',
    },


    productInfoItem: {
      flex: 1,
    },


    productInfoLabel: {
      fontSize: 10,

      color:
        '#98A2B3',
    },


    productInfoValue: {
      marginTop: 4,

      fontSize: 13,

      fontWeight: '800',

      color: navy,
    },


    productDivider: {
      height: 1,

      marginVertical: 18,

      backgroundColor:
        '#E7E9EC',
    },


    productBottomRow: {
      flexDirection:
        'row',

      alignItems:
        'flex-end',

      justifyContent:
        'space-between',
    },


    priceLabel: {
      fontSize: 11,

      color:
        '#98A2B3',
    },


    productPrice: {
      marginTop: 4,

      fontSize: 20,

      fontWeight: '800',

      color: navy,
    },


    viewDetailsContainer: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },


    viewDetailsText: {
      fontSize: 13,

      fontWeight: '800',

      color: gold,
    },


    arrowText: {
      marginLeft: 6,

      fontSize: 24,

      lineHeight: 24,

      fontWeight: '700',

      color: gold,
    },


    /*
     * EMPTY STATE
     */

    emptyState: {
      marginTop: 20,

      padding: 30,

      borderRadius: 20,

      alignItems:
        'center',

      backgroundColor:
        '#FFFFFF',
    },


    emptyTitle: {
      fontSize: 17,

      fontWeight: '800',

      color: navy,
    },


    emptyText: {
      marginTop: 8,

      textAlign:
        'center',

      fontSize: 13,

      lineHeight: 20,

      color:
        '#667085',
    },


    /*
     * INFORMATION
     */

    infoCard: {
      marginTop: 28,

      padding: 20,

      borderRadius: 20,

      backgroundColor:
        '#EEF4FF',
    },


    infoTitle: {
      fontSize: 16,

      fontWeight: '800',

      color: navy,
    },


    infoText: {
      marginTop: 8,

      fontSize: 13,

      lineHeight: 20,

      color:
        '#475467',
    },


    /*
     * DISCLAIMER
     */

    disclaimer: {
      marginTop: 20,

      textAlign:
        'center',

      fontSize: 11,

      lineHeight: 17,

      color:
        '#98A2B3',
    },

  });
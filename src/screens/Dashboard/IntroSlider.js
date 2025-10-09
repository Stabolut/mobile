import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { COLORS, Images, THEME } from "../../common";
import { useSelector } from 'react-redux';
const { width } = Dimensions.get("window");

const slides = [
    {
        id: 1,
        image: Images.purchageUSBWithETH, // Replace with your actual image path
        title: "Buy USB Coin with ETH",
        description: "Buy USB coins directly from our live panel by depositing ETH to your unique deposit address. Once the payment is confirmed, you'll receive the corresponding amount of USB coins instantly."
    },
    {
        id: 2,
        image: Images.purchageUSBWithBTC,
        title: "Buy USB Coin with BTC",
        description: "You can also purchase USB coins using Bitcoin (BTC). Simply send BTC to the deposit address provided on our live panel, and you'll receive the corresponding USB coins seamlessly."
    },
    {
        id: 3,
        image: Images.exchangeUSBWithETH,
        title: "Convert USB to ETH",
        description: "Exchange your USB coins for Ethereum (ETH) easily. Simply send your USB coins to us, and we'll process the conversion, returning the corresponding ETH to your wallet."
    },
    {
        id: 4,
        image: Images.exchangeUSBWithBTC,
        title: "Convert USB to BTC",
        description: "Swap your USB coins for Bitcoin (BTC) with ease. Transfer your USB coins, and we'll exchange them for the equivalent BTC, sending it directly to your wallet."
    },
];

const IntroSlider = (props) => {
    const carouselRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    let selectedTheme = useSelector((state) => state.walletReducer.theme)
    const theme = THEME[selectedTheme];

    const renderItem = ({ item }) => (
        <View style={[styles.slide]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Carousel
                ref={carouselRef}
                data={slides}
                renderItem={renderItem}
                width={width}
                height={400}
                onSnapToItem={(index) => setActiveIndex(index)}
                autoPlay={false}
                scrollAnimationDuration={300}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
            />

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
                {slides.map((_, index) => (
                    <View key={index} style={[styles.dot, activeIndex === index && styles.activeDot]} />
                ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                {activeIndex > 0 && (
                    <TouchableOpacity onPress={() => carouselRef.current?.prev()} style={styles.button}>
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                )}

                {activeIndex < slides.length - 1 ? (
                    <TouchableOpacity onPress={() => carouselRef.current?.next()} style={styles.button}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => props.onDone()} style={styles.button}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    slide: { width: "85%", height: "100%", alignSelf: "center" },
    title: { fontSize: 24, fontFamily: 'Poppins', fontWeight: "bold", alignSelf: "center", marginBottom: 10, color: "white",marginTop:10, },
    description: { fontSize: 16, textAlign: "justify", ontFamily: 'Poppins', alignSelf: "center", color: "white",paddingHorizontal:1 },
    dotsContainer: { flexDirection: "row" ,marginTop:20},
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ccc", marginHorizontal: 5 },
    activeDot: { backgroundColor: COLORS.BTN_BACKGROUND_COLOR },
    buttonContainer: { flexDirection: "row", marginTop: 20, width: "100%" },

    button: {
        padding: 10,
        backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
        flex: 1,
       
        marginHorizontal: 4,
        color: COLORS.WHITE,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    image: {
        width: "100%",
        height: "45%",
    },

    body: {
        fontSize: 16,
        marginTop: 4,
        textAlign: 'center',
        fontFamily: 'Poppins',
    },

    buttonText: { color: "#fff", fontSize: 16 },
});

export default IntroSlider;

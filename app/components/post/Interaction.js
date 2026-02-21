import * as Haptics from 'expo-haptics'; // Import Haptics module
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../../config/colors';
import AppText from '../AppText';

function Interaction({ image, text, style, onPress, enabled, noTint }) {
    // Initialize state to reflect whether the interaction is enabled
    const [hasBeenPressed, setHasBeenPressed] = useState(false);

    // Update pressed state based on enabled prop
    useEffect(() => {
        setHasBeenPressed(enabled);
    }, [enabled]);

    const handlePress = () => {
        // Update state only if the interaction is not enabled
        if (!enabled) {
            setHasBeenPressed(prevState => !prevState);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);  // Add haptic feedback
            if (onPress) {
                onPress();
            }
        }
    };

    return (
        <TouchableOpacity
            style={style}
            onPress={handlePress}
        >
            <Image
                style={[
                    styles.icon,
                    {
                        tintColor: noTint 
                            ? undefined // No tint if noTint is true
                            : (enabled
                                ? "#FC5193" // Pink tint if enabled (liked)
                                : (hasBeenPressed ? "#FC5193" : colors.white) // Pink if pressed, white if not
                            )
                    }
                ]}
                source={image}
            />
            <AppText style={styles.interactiontext}>{text}</AppText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    interactiontext: {
        fontSize: 14,
        color: colors.white,
        marginLeft: 8,
        fontWeight: 700,
        textAlign: 'center',
    },
});

export default Interaction;

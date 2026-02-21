import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';

export const useHaptics = () => {
    const triggerLongHaptic = async () => {
        for (let i = 0; i < 100; i++) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await new Promise(resolve => setTimeout(resolve, 50)); // Wait 50 ms between haptics
        }
    };

    return { triggerLongHaptic };
};

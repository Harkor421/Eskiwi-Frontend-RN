import React from 'react';
import { Text } from 'react-native';
import defaultStyles from '../config/styles';

function AppText({ children, style, numberOfLines, ellipsizeMode, adjustsFontSizeToFit= false}) {
    return (
        <Text
            style={[defaultStyles.text, style]} // Simplified style prop handling
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            adjustsFontSizeToFit={adjustsFontSizeToFit}
        >
            {children}
        </Text>
    );
}

export default AppText;

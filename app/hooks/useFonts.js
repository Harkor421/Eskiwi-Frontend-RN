import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        // Load Geist Mono fonts
        'GeistMono-Regular': require('./app/assets/fonts/geist/GeistMono-Regular.otf'),
        'GeistMono-Bold': require('./app/assets/fonts/geist/GeistMono-Bold.otf'),
        'GeistMono-Black': require('./app/assets/fonts/geist/GeistMono-Black.otf'),
        'GeistMono-Medium': require('./app/assets/fonts/geist/GeistMono-Medium.otf'),
        'GeistMono-SemiBold': require('./app/assets/fonts/geist/GeistMono-SemiBold.otf'),
        'GeistMono-UltraBlack': require('./app/assets/fonts/geist/GeistMono-UltraBlack.otf'),
        'GeistMono-UltraLight': require('./app/assets/fonts/geist/GeistMono-UltraLight.otf'),

        // Load Work Sans fonts
        'WorkSans-Thin': require('./app/assets/fonts/work-sans/WorkSans-Thin.ttf'),
        'WorkSans-Light': require('./app/assets/fonts/work-sans/WorkSans-Light.ttf'),
        'WorkSans-Regular': require('./app/assets/fonts/work-sans/WorkSans-Regular.ttf'),
        'WorkSans-Medium': require('./app/assets/fonts/work-sans/WorkSans-Medium.ttf'),
        'WorkSans-SemiBold': require('./app/assets/fonts/work-sans/WorkSans-SemiBold.ttf'),
        'WorkSans-Bold': require('./app/assets/fonts/work-sans/WorkSans-Bold.ttf'),
        'WorkSans-ExtraBold': require('./app/assets/fonts/work-sans/WorkSans-ExtraBold.ttf'),
        'WorkSans-Black': require('./app/assets/fonts/work-sans/WorkSans-Black.ttf'),
        'WorkSans-ExtraLight': require('./app/assets/fonts/work-sans/WorkSans-ExtraLight.ttf'),
        'WorkSans-ExtraBoldItalic': require('./app/assets/fonts/work-sans/WorkSans-ExtraBoldItalic.ttf'),
        'WorkSans-BoldItalic': require('./app/assets/fonts/work-sans/WorkSans-BoldItalic.ttf'),
        'WorkSans-SemiBoldItalic': require('./app/assets/fonts/work-sans/WorkSans-SemiBoldItalic.ttf'),
        'WorkSans-Italic': require('./app/assets/fonts/work-sans/WorkSans-Italic.ttf'),
      });

      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};

export default useFonts;

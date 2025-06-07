import { Stack } from "expo-router";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import {setStatusBarStyle} from "expo-status-bar";

export default function RootLayout() {

  useFonts({
    "Fredoka-Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
    "Fredoka-Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
    "Figtree-Regular": require("../assets/fonts/Figtree-Regular.ttf"),
    "Figtree-Bold": require("../assets/fonts/Figtree-Bold.ttf"),
    "Figtree-Black": require("../assets/fonts/Figtree-Black.ttf"),
  })

  return <Stack screenOptions={{ headerShown: false }}/>;
}

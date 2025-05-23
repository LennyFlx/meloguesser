import { Stack } from "expo-router";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import {setStatusBarStyle} from "expo-status-bar";

export default function RootLayout() {

  useFonts({
    "Fredoka-Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
    "Fredoka-Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
  })

  return <Stack screenOptions={{ headerShown: false }}/>;
}

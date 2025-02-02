
import { useNavigation, useRoute }                        from "@react-navigation/native";
import React, { useEffect, useState }                     from "react";
import { TouchableOpacity, View, Image, FlatList, Text }  from "react-native";
import { SafeAreaView }                                   from "react-native-safe-area-context";
import { GameParams }                                     from "../../@types/navigation";
import { Background }                                     from "../../componentes/background";
import { Entypo }                                         from "@expo/vector-icons";
import logoImg                                            from "../../assets/logo.png";

import { styles }                                         from "./styles";
import { THEME }                                          from "../../theme";
import { Heading }                                        from "../../componentes/Heading";
import { DuoCard, DuoCardProps }                          from "../../componentes/DuoCard";
import { DuoMatch }                                       from "../../componentes/DuoMatch";

export function Game() {
  const route = useRoute();
  const navigation = useNavigation();

  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState("");
  const game = route.params as GameParams;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getDiscordUser = async (adsId: string) => {
    await fetch(`http://192.168.0.156:3333/ads/${adsId}/discord`)
      .then((response) => response.json())
      .then((data) => {
        setDiscordDuoSelected(data.discord);
      });
  };

  useEffect(() => {
    fetch(`http://192.168.0.156:3333/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => {
        setDuos(data);
      });
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>
          <Image source={logoImg} style={styles.logo} />

          <View style={styles.right} />
        </View>
        
        <Image
          source={{ uri: game.banner }}
          style={styles.cover}
          resizeMode="cover"
        />
        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />

        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard
              data={item}
              onConnect={() => {
                getDiscordUser(item.id);
              }}
            />
          )}
          style={styles.containerList}
          contentContainerStyle={
            duos.length === 0 ? styles.emptyList : styles.contentList
          }
          ListEmptyComponent={() => (
            <Text style={styles.emptyList}>
              Não há anúncios publicados ainda.
            </Text>
          )}
        />

        <DuoMatch
          discord={discordDuoSelected}
          visible={discordDuoSelected.length > 0}
          onClose={() => setDiscordDuoSelected("")}
        />
      </SafeAreaView>
    </Background>
  );
}
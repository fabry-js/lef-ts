import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  GenericNavProps,
  GenericStackParamList,
} from "../../../paramlists/GenericStackParamList";
import { connect, useDispatch, useSelector } from "react-redux";
import { addItemToCart, updateTotal } from "../../../store/cartSlice";
import FaseProteine from "./FaseProteine";
import FaseGrassi from "./FaseGrassi";
import { Button, Card, List, Text, Title } from "react-native-paper";
import { getCurrentIngredients } from "../../../store/ingredientsSlice";
import { ScrollView, View } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import Toast from "react-native-toast-message";

const mapDispatch = { addItemToCart };
const Stack = createStackNavigator<GenericStackParamList>();

function FaseCarboidrati({ navigation }: GenericNavProps<"Fasi">) {
  const ingredients = useSelector(getCurrentIngredients);

  const dispatch = useDispatch();

  const filteredByPhaseIngredients = ingredients.filter(
    (ingredient: any) => ingredient.phase === "carboidrati"
  );

  const [sliderQuantityValue, setSliderQuantityValue] = useState<any[]>(
    filteredByPhaseIngredients.map((ingredient: any) => ({
      value: 100,
      finalPrice: ingredient.price,
      ...ingredient,
    }))
  );

  const onToggleSlider = (
    value: number,
    ingredient: any,
    finalPrice: number,
    id: number
  ) => {
    const temp = [...sliderQuantityValue];
    temp.splice(id, 1, {
      value,
      finalPrice,
      ...ingredient,
    });
    setSliderQuantityValue(temp);
  };

  let totale = 0;

  const addIngredientToCart = (
    ingredient: any,
    finalPrice: number,
    quantity: number
  ) => {
    const { name } = ingredient;
    totale = 0;
    totale += finalPrice;
    dispatch(
      addItemToCart({
        name,
        price: finalPrice,
        quantity,
      })
    );
    Toast.show({
      type: "success",
      position: "top",
      autoHide: true,
      text1: "Perfetto! Elemento Aggiunto al carrello!",
    });
    return dispatch(
      updateTotal({
        totale,
      })
    );
  };
  return (
    <ScrollView>
      <Card>
        <Card.Content>
          <Title>Fonte Di Carboidrati</Title>
        </Card.Content>
      </Card>
      {filteredByPhaseIngredients.map((ingredient: any, id: number) => {
        const { name, price, imageURI } = ingredient;
        const { calorie, proteine, carboidrati, grassi } = ingredient.macronut;
        return (
          <Card key={id} style={{ padding: "2% 2% 2% 2%" }}>
            <Card.Cover source={{ uri: imageURI }} />
            <Card.Content>
              <Title>
                {" "}
                {name} | €
                {((sliderQuantityValue[id].value * price) / 100).toFixed(1)}
              </Title>
              <List.Accordion title="Modifica Quantità">
                <View style={{ marginLeft: "2%" }}>
                  <Slider
                    value={sliderQuantityValue[id].value}
                    minimumValue={50}
                    maximumValue={200}
                    step={25}
                    style={{ width: "75%" }}
                    minimumTrackTintColor="#36ff00"
                    maximumTrackTintColor="#000"
                    onValueChange={(value) => {
                      onToggleSlider(
                        value,
                        ingredient,
                        (price * sliderQuantityValue[id].value) / 100,
                        id
                      );
                    }}
                  />
                  <Text>{sliderQuantityValue[id].value}g selezionati</Text>
                </View>
              </List.Accordion>
              <List.Accordion title="Macronutrienti">
                <View style={{ padding: "4% 4% 4% 4%" }}>
                  <Title>Calorie: {calorie} kCal</Title>
                  <Text>Carboidrati: {carboidrati} g</Text>
                  <Text>Proteine: {proteine} g</Text>
                  <Text>Grassi: {grassi} g</Text>
                </View>
              </List.Accordion>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() =>
                  addIngredientToCart(
                    ingredient,
                    sliderQuantityValue[id].finalPrice,
                    sliderQuantityValue[id].value
                  )
                }
              >
                <FontAwesome name="cart-plus" size={24} color="green" />
                <Text style={{ color: "green" }}> Aggiungi al carrello</Text>
              </Button>
            </Card.Actions>
          </Card>
        );
      })}
      <Card>
        <Card.Actions>
          <Button
            mode="outlined"
            style={{ width: "50%", height: "100%" }}
            onPress={() => navigation.navigate("FaseProteine")}
          >
            <AntDesign name="arrowright" size={24} color="green" />
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const FasiStack = () => {
  return (
    <Stack.Navigator initialRouteName="Fasi">
      <Stack.Screen
        name="Fasi"
        options={{ headerShown: false }}
        component={FaseCarboidrati}
      />
      <Stack.Screen
        name="FaseProteine"
        options={{ headerShown: false }}
        component={FaseProteine}
      />
      <Stack.Screen
        name="FaseGrassi"
        options={{ headerShown: false }}
        component={FaseGrassi}
      />
    </Stack.Navigator>
  );
};

export default connect(null, mapDispatch)(FasiStack);

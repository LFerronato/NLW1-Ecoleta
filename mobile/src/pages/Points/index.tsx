import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, SafeAreaView } from 'react-native';
// import { HOST_SERVER } from 'react-native-dotenv'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { SvgUri } from 'react-native-svg'

import api from '../../services/api'
import styles from './styles'

interface Item {
  id: number
  title: string
  image_url: string
}
interface Point {
  id: number
  name: string
  image: string
  image_url: string
  latitude: number
  longitude: number
}
interface Params {
  uf: string
  city: string
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [itemsSelected, setItemsSelected] = useState<number[]>([])
  const [initialPositon, setInitialPosition] = useState<[number, number]>([0, 0])

  const navigation = useNavigation()
  const route = useRoute()
  const routeParams = route.params as Params

  useEffect(() => { //getCurrentPosition
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Ooooops...!', 'Precisamos de sua permissão para obter sua localização')
        return
      }
      const { latitude, longitude } = (await Location.getCurrentPositionAsync()).coords
      setInitialPosition([latitude, longitude])
    }
    loadPosition()
  }, [])
  useEffect(() => { //get('items')
    api.get('items').then(resp => { setItems(resp.data) })
  }, [])
  useEffect(() => { //get('points') and filter
    api.get('points', {
      params: {
        city: (routeParams.city).trim(),
        uf: routeParams.uf,
        items: itemsSelected
      }
    }).then(resp => setPoints(resp.data))
  }, [itemsSelected])

  function handleNavigateBack() {
    navigation.goBack()
  }
  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', {
      point_id: id,
      location: {
        lat: initialPositon[0],
        long: initialPositon[1]
      }
    })
  }
  function handleSelectItems(idToAdd: number) {
    const alreadySelected = itemsSelected.findIndex(i => i === idToAdd)

    if (alreadySelected >= 0) {
      const filteredItems = itemsSelected.filter(i => i !== idToAdd)

      setItemsSelected(filteredItems)
    } else {

      setItemsSelected([...itemsSelected, idToAdd])
    }
  }
  // só é necessário colocar uma arrowFunction quando a função recebe parametro,
  // para que não haja "execução infinita"
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={{ paddingBottom: 10 }}>
          <Icon name='arrow-left' size={36} color='#34cb79' onPress={handleNavigateBack} />
        </TouchableOpacity>
        <Text style={styles.title}>😎 Bem Vindo</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
        <View style={styles.mapContainer}>
          {initialPositon[0] !== 0 &&
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPositon[0],
                longitude: initialPositon[1],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
            >
              {points.map(p => (p.id !== 7) ? (
                <Marker
                  key={String(p.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(p.id)}
                  coordinate={{
                    latitude: p.latitude,
                    longitude: p.longitude,
                  }} >
                  <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{ uri: p.image_url }} />
                    <Text style={styles.mapMarkerTitle}>{p.name}</Text>
                  </View>
                </Marker>
              ) : null)}
            </MapView>
          }
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(i => (
            <TouchableOpacity
              key={String(i.id)}
              style={[styles.item, itemsSelected.includes(i.id) ? styles.selectedItem : {}]}
              onPress={() => { handleSelectItems(i.id) }}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={i.image_url} />
              <Text style={styles.itemTitle}>{i.title}</Text>
            </TouchableOpacity>))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Points;


import React, { useState, useEffect } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import qs from 'qs'
import { View, Text, Image, TouchableOpacity, SafeAreaView, Linking, Alert } from 'react-native';
// import * as MailComposer from 'expo-mail-composer'
import api from '../../services/api'

import styles from './styles'

interface Params {
  point_id: number
  location: {
    lat: number
    long: number
  }
}
interface Data {
  point: {
    image: string
    name: string
    email: string
    whatsapp: string
    city: string
    uf: string
    latitude: number
    longitude: number
  }
  items: {
    title: string
  }[]
}

const Points = () => {
  const [data, setData] = useState({} as Data)

  const navigation = useNavigation()
  const route = useRoute()
  const routeParams = route.params as Params

  useEffect(() => { //get Point Data
    api.get(`points/${routeParams.point_id}`).then(resp => {
      setData(resp.data)
    })
  }, [])

  function handleNavigateBack() {
    navigation.goBack()
  }
  function handleComposeMail() {
    if (!(data.point.email)) {
      Alert.alert('Não cadatrado :/', 'Este local não tem email cadastrado.')
      return
    }

    let url = 'ms-outlook://compose?';

    // Create email link query
    const query = qs.stringify({
      to: data.point.email,
      subject: 'Interesse em na coleta de resíduos',
      body: 'body',
    });

    if (query.length) {
      url += `${query}`;
    }

    // check if we can use this link
    console.log(url);

    // const canOpen = await Linking.canOpenURL(url);
    // if (!canOpen) {
    //   throw new Error('Provided URL can not be handled');
    // }

    return Linking.openURL(url);
  }
  function handleComposeWhatsApp() {
    if (!(data.point.whatsapp)) {
      Alert.alert('Não cadatrado :/', 'Este local não tem WhatsApp cadastrado.')
      return
    }
    Linking.openURL(
      `whatsapp://send?phone=55${data.point.whatsapp}&text=Tenho interesse!`
    )
  }
  function handleComposeHowToGet() {
    Linking.openURL(
      `https://www.google.com.br/maps/dir/${
      routeParams.location.lat + ',' + routeParams.location.long
      }/${
      data.point.latitude + ',' + data.point.longitude
      }`
    )
  }

  if (!data.point) {
    return null
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={{ paddingBottom: 10 }}>
          <Icon name='arrow-left' size={36} color='#34cb79' onPress={handleNavigateBack} />
        </TouchableOpacity>
        <Image style={styles.pointImage} source={{ uri: data.point.image }} />

        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(i => i.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleComposeWhatsApp}>
            <FontAwesome name='whatsapp' size={20} color='#FFF' />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </RectButton>
          <RectButton style={styles.button} onPress={handleComposeMail}>
            <Icon name='mail' size={20} color='#FFF' />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
          <RectButton style={styles.button} onPress={handleComposeHowToGet}>
            <Icon name='map' size={20} color='#FFF' />
            <Text style={styles.buttonText}>Como Chegar?</Text>
          </RectButton>
        </View>
      </View>
    </SafeAreaView>);
}

export default Points;

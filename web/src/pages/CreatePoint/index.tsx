import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios'
import api from '../../services/api'

import './styles.css'

import Dropzone from '../../components/Dropzone'
import logo from '../../assets/logo.svg'


// array ou objeto: manualmente informa o tipo da variavel
interface Item {
  id: number
  title: string
  image_url: string
}

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  id: number
  nome: string
}

const CreatePoint = () => {
  // const [items, setItems] = useState<Array<Item>>([])
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<IBGECityResponse[]>([])

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: ''
  })

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [itemsSelected, setItemsSelected] = useState<number[]>([])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
  const [selectedFile, setSelectedFile] = useState<File>()

  const history = useHistory()

  useEffect(() => {
    api.get('items').then(resp => {
      // console.log(resp.data);
      setItems(resp.data);
    })
  }, [])

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(resp => {
        const ufInitials = resp.data.map(uf => uf.sigla)
        setUfs(ufInitials);
      })
  }, [])
  useEffect(() => {
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(resp => {
        if (selectedUf === '0') { return }
        const filteredCities = resp.data.map(city => ({ 'id': city.id, 'nome': city.nome }))
        setCities(filteredCities);
      })
  }, [selectedUf])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      setInitialPosition([latitude, longitude])
    })
  }, [])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(event.target.value)
  }
  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value)
  }
  function handleMapclick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }
  function handleSelectItem(idToAdd: number) {
    const alreadySelected = itemsSelected.findIndex(i => i === idToAdd)

    if (alreadySelected >= 0) {
      const filteredItems = itemsSelected.filter(i => i !== idToAdd)

      setItemsSelected(filteredItems)
    } else {

      setItemsSelected([...itemsSelected, idToAdd])
    }

  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const data = new FormData()

    data.append('name', formData.nome)
    data.append('email', formData.email)
    data.append('whatsapp', formData.whatsapp)
    data.append('latitude', String(selectedPosition[0]))
    data.append('longitude', String(selectedPosition[1]))
    data.append('city', selectedCity)
    data.append('uf', selectedUf)
    data.append('items', itemsSelected.join(","))

    if (selectedFile) {
      data.append('image', selectedFile)
    }

    try {
      await api.post('points', data)
      history.push('/')
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div id='page-create-point'>
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>
        <Dropzone onFileUpload={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>

          </legend>
          <div className='field'>
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name='nome'
              id='name'
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className='field'>
              <label htmlFor="email">E-Mail</label>
              <input
                type="email"
                name='email'
                id='email'
                onChange={handleInputChange}
              />
            </div>
            <div className='field'>
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                type="text"
                name='whatsapp'
                id='whatsapp'
                onChange={handleInputChange}
              />
            </div>
          </div>

        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onclick={handleMapclick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}>
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className='items-grid'>
            {items.map(i => (
              < li
                key={i.id}
                onClick={() => handleSelectItem(i.id)}
                className={itemsSelected.includes(i.id) ? 'selected' : ''}>
                <img src={i.image_url} alt={i.title} />
                <span>{i.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type='submit'>
          Cadastrar ponto de coleta
        </button>

      </form>
    </div >
  );
}

export default CreatePoint;
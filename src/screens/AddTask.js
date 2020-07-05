import React, {Component} from 'react'
import {Modal, View, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity, TextInput, Platform} from 'react-native'
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'


import commonStyles from '../commonStyles'

const initialState = {desc: '', date: new Date(), showDatePicker:false}

export default class AddTask extends Component {

    state = {
        ...initialState
    }

    save = () => {
        const newTask = { // clonando a variavel state

            // ...this.state -------- esse é um jeito
            desc: this.state.desc, // esse é outro jeito
            date: this.state.date 
            
        }

        this.props.onSave && this.props.onSave(newTask) // se a this.props.onSave estiver setada faça
        this.setState({...initialState})

    }

    getDateTimePicker = () => {

        let datePicker = <DateTimePicker
        value={this.state.date}
        onChange={( _ ,date)=> { // o primeiro parametro é o event, mas só iremos usar o date
            this.setState({date: date}, this.setState({ showDatePicker:false }))
        }}
        mode='date' />

        const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')

        if (Platform.OS==='android'){
            datePicker = (
                <View>
                    <TouchableOpacity onPress={()=> this.setState({showDatePicker:true})}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker}
                </View>
            )
        }

        return datePicker
    }


    render() {
        return(
            <Modal transparent={true} visible={this.props.isVisible} onRequestClose={this.props.onCancel}
            animationType='slide'>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>Nova Tarefa: </Text>
                    <TextInput style={styles.input} 
                    placeholder='Informe a Descrição...' 
                    value={this.state.desc}
                    onChangeText={desc => {this.setState({desc:desc})}} />
                    {this.getDateTimePicker()}
                    <View style={styles.buttons}> 
                    <TouchableOpacity onPress={this.props.onCancel}>
                        <Text style={styles.button}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.save}>
                        <Text style={styles.button}>Salvar</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    background:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    container: {
       
        backgroundColor: '#FFF'
    },
    header:{
        fontFamily:commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.today,
        color:commonStyles.colors.secundary,
        fontSize:15,
        textAlign:'center',
        padding: 18
    },
    buttons:{
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    input:{
        fontFamily: commonStyles.fontFamily,
        margin:15,
        height:40,
        marginTop:10,
        marginLeft:10,
        backgroundColor:'#FFF',
        borderWidth:1,
        borderColor:'#E3E3E3',
        borderRadius:6        
    },
    button:{
        margin:20,
        marginRight:30,
        color: commonStyles.colors.today
    },

    date:{
        fontFamily: commonStyles.fontFamily,
        fontSize:20,
        marginLeft:15
    }
})
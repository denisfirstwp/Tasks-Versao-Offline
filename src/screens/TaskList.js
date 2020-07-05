import React, {Component} from 'react';
import {Alert, View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform} from 'react-native';




import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br' // traduz o valor das datas para o portugues
import AsyncStorage from '@react-native-community/async-storage'

import Task from '../components/Tasks'
import AddTask from './AddTask'
import commonStyles from '../commonStyles'
import todayImage from '../../assets/imgs/today.jpg';

const initialState = {
    showDoneTasks: true,
    showAddTask:false,
    visibleTasks: [],
    tasks: []
    }

export default class TaskList extends Component {

    state = {
       ...initialState
    }

    componentDidMount = async () => {
        const  stateString = await AsyncStorage.getItem('ZICA')
        const state = JSON.parse(stateString) || initialState

        this.setState(state, this.filterTasks)
    }

    toggleFilter =  () => {
        this.setState({showDoneTasks: !this.state.showDoneTasks }, this.filterTasks) // EXECUTA A FUNCAO DEPOIS QUE O STATE FOR ALTERADO

       // this.filterTasks();     
    }

    filterTasks = async () => {
        let visibleTasks = null
        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks] // CLONANDO O ARRAY 
        }else{
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter((pending))
        }

        this.setState({visibleTasks:visibleTasks})
        //console.log(JSON.stringify(this.state))

        await AsyncStorage.setItem('ZICA', JSON.stringify(this.state))
        console.log( await AsyncStorage.getItem('ZICA'))
        
    }

   
    toggleTask = (taskId) => {

        const tasks = [...this.state.tasks] //criando uma copia do array com spread
        
        tasks.forEach(task => {
            if(task.id===taskId){
                task.doneAt = task.doneAt ? null : new Date()
            } 
        })

        this.setState({tasks : tasks}, this.filterTasks) // executar a funcao filterTasks depois de alter o checked

    }

    addTask = (newTask) => {

        if(!newTask.desc || !newTask.desc.trim()) { //SE A STRING FOR FALSA ENTRE
            Alert.alert('Dados Inválidos', 'Descrição não informada !')
            return
        }

        const tasks = [...this.state.tasks]

        tasks.push({
            id:Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt:null
        })

        this.setState({tasks, showAddTask: false}, this.filterTasks)
        
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({ tasks: tasks }, this.filterTasks)
    }


    // Componente baseado em classe precisa definir função render
    render(){
        const today = moment().locale('pt-br').format('ddd,D [de] MMMM')
        return(
            <View style={styles.container}>
                <AddTask 
                isVisible={this.state.showAddTask} 
                onCancel={() => this.setState({showAddTask:false})}
                onSave={this.addTask} />
                <ImageBackground style={styles.background} source={todayImage } >
                    <View style={styles.iconBar}> 
                    <TouchableOpacity onPress={this.toggleFilter}>
                        <Icon color={commonStyles.colors.secundary} size={30} name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} />
                    </TouchableOpacity>

                    </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>Hoje</Text>
                    <Text style={styles.subtitle}>{today}</Text>
                </View>
                </ImageBackground>
                <View style={styles.taskList}>
                <FlatList data={this.state.visibleTasks} // passando um array para o flatlist
                keyExtractor={(item) => `${item.id}`} // definindo a key (todo array precisa de key)
                renderItem={({item})=> <Task {...item} 
                toggleTask={this.toggleTask}
                onDelete={this.deleteTask} />} // renderizando componente array com valores do array
                />
                </View>
                <TouchableOpacity style={styles.addButton}
                 onPress={()=> this.setState({showAddTask:true})}
                 activeOpacity={0.7}>
                    <Icon name="plus" size={20} color={commonStyles.colors.secundary} />
                </TouchableOpacity>

               
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    background:{
        flex:3
    },
    taskList: {
        flex: 7 
    },
    titleBar:{
        flex:1,
        justifyContent:'flex-end'   
    },
    title:{
        fontFamily: commonStyles.fontFamily,
        fontSize: 50,
        color:commonStyles.colors.secundary,
        fontSize:50,
        marginLeft:20,
        marginBottom:20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color:commonStyles.colors.secundary,
        fontSize:20,
        marginLeft:20,
        marginBottom:30
    },
    iconBar:{
        flexDirection:'row',
        marginHorizontal:20,
        justifyContent:'flex-end',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },

    addButton:{
        position: 'absolute',
        right:30,
        bottom:30,
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor:commonStyles.colors.today,
        justifyContent:'center',
        alignItems:'center'
    }


})
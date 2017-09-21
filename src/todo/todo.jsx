import React, {Component} from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm'
import TodoList from './todoList'

const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component{

    constructor(props){
        super(props)
        this.state = {
            description: '',
            list: []
        }
        this.handleAdd = this.handleAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMarkAnDone = this.handleMarkAnDone.bind(this)
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.refresh()
    }

    refresh(description = ''){
        const search = description ? `&description__regex=/${description}/`:''
        axios.get(`${URL}?sort=-createAt${search}`)
            .then(resp=>this.setState({...this.state, description, list:resp.data}))
    }

    handleRemove(todo){
        axios.delete(`${URL}/${todo._id}`)
            .then(()=>this.refresh(this.state.description))
    }

    handleAdd(){
        const description = this.state.description
        axios.post(URL, {description})
            .then(resp=>this.refresh())
    }
    handleMarkAnDone(todo){
        axios.put(`${URL}/${todo._id}`,{...todo,done:true})
            .then(()=>this.refresh(this.state.description))
    }
    handleMarkAsPending(todo){
        axios.put(`${URL}/${todo._id}`,{...todo,done:false})
            .then(()=>this.refresh(this.state.description))
    }
    handleChange(e){
        this.setState({...this.state, description:e.target.value })
    }
    handleClear(){
        this.refresh()
    }
    handleSearch(){
        this.refresh(this.state.description)
    }
    render(){
        return (
            <div>
                <PageHeader name="Tarefa" small="Cadastro"/>
                <TodoForm 
                    onChange={this.handleChange}
                    description={this.state.description}
                    handleAdd={this.handleAdd}
                    handleSearch={this.handleSearch}
                    handleClear={this.handleClear}/>
                <TodoList 

                    list={this.state.list}
                    handleRemove={this.handleRemove}
                    handleMarkAnDone={this.handleMarkAnDone}
                    handleMarkAsPending={this.handleMarkAsPending}/>

            </div>
        )
    }
}
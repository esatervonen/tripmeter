import React from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts'

const Barchart = (props) => {
    return(
        <ResponsiveContainer width="95%" height='100%'>
            <BarChart margin={{top: 15, left: 0, right: 5, bottom: 25}} data={props.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tick={false}/>
                <Tooltip />
                <Legend layout='horizontal' wrapperStyle={{bottom:25,left:0,position:'relative'}}/>
                <Bar dataKey="Aika" fill="#82cddd" unit=' tuntia' />
                <Bar dataKey="Kulutus" fill="#8b998f" unit=' litraa' />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default Barchart
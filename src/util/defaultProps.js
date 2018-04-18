import src from '../img/default_img.png';

const editTheme = [
    {
        color:'royalblue',
        fontColor:'#fff'
    },
    {
        color:'#f44336',
        fontColor:'#fff'
    },
    {
        color:'#e91e63',
        fontColor:'#fff'
    },
    {
        color:'#009688',
        fontColor:'#fff'
    },
    {
        color:'#ffeb3b',
        fontColor:'#333'
    },
    {
        color:'#fff',
        fontColor:'#333'
    },
]

const props = {
    'View':{
        style:{
            w:200,
            h:200,
            backgroundColor:'#c4d9ff',
        },
        props:{
            allowdrop:true,
            editable:true,
            disabled:false
        },
        datasource:{},
        focus:{
            enable:false,
            onview:false,
            backgroundColor:'#f74848'
        },
        intent:{}
    },
    'Image':{
        style:{
            w:100,
            h:100,
        },
        props:{
            allowdrop:false,
            editable:true,
            alt: '',
            src: src,
            srcId:null,
            disabled:false
        },
        datas: {},
        focus:{
            enable:true,
            onview:false,
            outlineWidth:3,
            outlineColor:'#f74848'
        },
        intent:{}
    },
    'Text':{
        style:{
            w:56,
            h:21,
            fontSize:14
        },
        props:{
            allowdrop:false,
            editable:true,
            text: '默认文本',
            multiline: true,
            disabled:false
        },
        focus:{},
        datas: {},
        intent:{}
    },
    'ListView':{
        style:{
            w:300,
            h:300,
        },
        props:{
            allowdrop:false,
            editable:true,
            column: 3,
            row: 3,
            columnGap: 10,
            rowGap: 10
        },
        item:[{
            type: 'View',
            style: {
                backgroundColor:'#c4d9ff',
            },
            props: {
                editable: false,
                allowdrop: true,
                disabled: true
            },
            focus:{
                enable:true,
                onview:false,
                outlineWidth:3,
                outlineColor:'#f74848'
            },
            intent:{},
            children:[]
        }],
        datasource:{}
    },
    'TabView':{
        style:{
            w:300,
            h:300,
        },
        props:{
            allowdrop:false,
            editable:true,
            direction: "top",
            dynamic:false,
            tabWidth:100,
            tabHeight:50,
            tabGap:10,
            tabAlign:'start',
        },
        datasource:{},
        tabs: [{
            type: 'View',
            style: {
                backgroundColor:'#c4d9ff',
            },
            props: {
                editable: false,
                allowdrop: true,
                disabled: true
            },
            children:[],
            focus:{
                disabled:true,
                enable:true,
                onview:false,
                outlineWidth:3,
                outlineColor:'#f74848'
            },
            select:{
                disabled:true,
                enable:true,
                onview:false,
                backgroundColor:'#f74848'
            }, 
        }],
        contents: [{
            type: 'View',
            style: {
                backgroundColor:'#ffd4c4',
            },
            props: {
                editable: false,
                allowdrop: true,
                disabled: true
            },
            children:[]
        }],
    }
}

export {editTheme};

export default props;
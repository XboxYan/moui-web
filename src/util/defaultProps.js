import src from '../img/default_img.png';

export default {
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
        datasource:{}
    },
    'Image':{
        props:{
            allowdrop:false,
            editable:true,
            alt: '',
            src: src,
            disabled:false
        },
        datas: {}
    },
    'Text':{
        props:{
            allowdrop:false,
            editable:true,
            text: '默认文本',
            multiline: true,
            disabled:false
        },
        datas: {}
    },
    'ListView':{
        style:{
            w:200,
            h:300,
        },
        props:{
            allowdrop:false,
            editable:true,
            column: 3,
            row: 3,
            columngap: 10,
            rowgap: 10
        },
        item:{
            type: 'View',
            style: {
                backgroundColor:'#c4d9ff',
            },
            props: {
                editable: false,
                allowdrop: true,
                disabled: true
            },
            datasource: {},
            child: []
        },
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
        },
        datasource:{},
        tabs: {
            type: 'View',
            style: {
                w:50,
                h:50,
                backgroundColor:'#c4d9ff',
            },
            props: {
                editable: true,
                allowdrop: true,
                disabled: false
            },
            datasource: {},
            child: []
        },
        contents: {
            type: 'View',
            style: {
                backgroundColor:'#ffd4c4',
            },
            props: {
                editable: false,
                allowdrop: true,
                disabled: true
            },
            datasource: {},
            child: []
        },
    }
}
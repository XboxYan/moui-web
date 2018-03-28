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
        style:{
            w:100,
            h:100,
        },
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
        datas: {}
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
            datasource: {},
            children: []
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
            datasource: {},
            children: []
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
            datasource: {},
            children: []
        }],
    }
}
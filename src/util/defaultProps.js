import src from '../img/default_img.png';

export default {
    'View':{
        style:{
            w:200,
            h:200
        },
        props:{
            allowdrop:true,
            editable:true
        },
        datasource:{}
    },
    'Image':{
        props:{
            allowdrop:false,
            editable:true,
            alt: '',
            src: src
        },
        datas: {}
    },
    'Text':{
        props:{
            allowdrop:false,
            editable:true,
            text: '默认文本',
            multiline: true
        },
        datas: {}
    },
    'ListView':{
        style:{
            w:200,
            h:300
        },
        props:{
            allowdrop:false,
            editable:true,
            column: 1,
            gutter: 10
        },
        item:{
            type: 'View',
            style: {
                backgroundColor:'#fc5270',
                w: 200,
                h: 100,
            },
            props: {
                editable: true,
                allowdrop: true,
            },
            child: []
        },
        datasource:{}
    }
}
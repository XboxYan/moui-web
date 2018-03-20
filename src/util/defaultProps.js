import src from '../img/default_img.png';

export default {
    'View':{
        style:{
            w:100,
            h:100
        },
        props:{
            allowdrop:true,
            editable:true
        }
    },
    'Image':{
        props:{
            allowdrop:false,
            editable:true,
            alt: '',
            src: src
        },
        style:{
            overflow:'hidden'
        }
    },
    'Text':{
        props:{
            allowdrop:false,
            editable:true,
            text: '默认文本',
            multiline: true
        }
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
                backgroundColor:'pink',
                w: 100,
                h: 100,
            },
            props: {
                editable: false,
                allowdrop: true,
            },
            child: []
        }
    }
}
import React, { PureComponent,Fragment } from 'react';
import EditView from './EditView';

export default class ListView extends PureComponent {

    render() {
        const {
            props: {
                column,
                row,
                columnGap,
                rowGap,
            },
            index
        } = this.props;

        const style = {...this.props.style,
            ...{
                gridTemplateColumns:`repeat(${column},auto)`,
                gridTemplateRows:`repeat(${row},auto)`,
                gridColumnGap:columnGap,
                gridRowGap:rowGap,
            }
        }

        const list = Array.from({length:column*row}, (v,k) => k);
        
        return (
            <EditView {...this.props} style={style} className="ListView">
                {
                    list.map((el,i)=>(
                        <Fragment key={index+'~'+i}>
                            {this.props.children}
                        </Fragment>
                    ))
                }
            </EditView>
        );
    }
}

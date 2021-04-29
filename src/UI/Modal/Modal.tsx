import React from 'react';
import ReactJson from 'react-json-view'
import { Button, Icon, Modal } from 'mx-ui';

import S from './Modal.styl';
import * as H from 'App/App.helpers';
import { FieldConfig } from 'App/App.types';

export const JSON_CONFIG = {
    enableClipboard: false,
    displayObjectSize: false,
    displayDataTypes: false,
    displayArrayKey: false
};

type Props = {
    fieldsConfig: any
    data: any;
    onClose: Function;
    mainKey: string;
}

type State = {
    data: any;
    isCopied: boolean;
    isVisible: boolean;
}

export class DataModal extends React.Component<Props, State> {
    
    constructor(props){
        super(props);

        this.state = {
            data: props.data,
            isCopied: false,
            isVisible: true
        };
    }

    handleCopyClick(value) {
        H.copyToClipboard(value);
        this.setState({ isCopied: true });
        setTimeout(() => this.setState({ isCopied: false }), 2000);
    }

    handleCloseClick() {
        this.setState({ isVisible: false, data: null });
        this.props.onClose();
    }

    renderObjectValue(key, value) {
        const { isCopied } = this.state;
        const { fieldsConfig } = this.props;
        const config: FieldConfig = fieldsConfig[key];

        switch (config.type) {
            case 'json':
                try {
                    const parsedJson = JSON.parse(value);
                    return <div className={S.json} >
                        <Button
                            variant="clear"
                            square
                            className={S.copy}
                            disabled={isCopied}
                            onClick={() => this.handleCopyClick(value)}>
                            <Icon size="m" type="copy" variant="primary" />
                        </Button>
                        <ReactJson src={parsedJson} {...JSON_CONFIG} />
                    </div>;
                } catch (e) {
                    return <div>JSON parsing error</div>;
                }
            case 'array_text':
                return <div>{[...value].join(', ')}</div>;
            case 'image':
                return <img className={S.image} src={value} />;
            default:
                return <pre className={S.pre}>{value}</pre>;
        }
    }

    renderModalContent(data) {
        const { fieldsConfig } = this.props;

        if (!data) return;

        return <div className={S.modalContent}>
            {Object.entries(data).map(([key, value]) => {
                const config: FieldConfig = fieldsConfig[key];

                if (!config || !value || value.length === 0) return null;
                if (config.excludeFromModal) return null;
                if (config.type === 'image' && value === 'Link') return null;

                return (
                    <div key={key} className={S.modalContentRow}>
                        <div className={S.infoKey}>{H.upFirstLetter(key)}</div>
                        <div>{this.renderObjectValue(key, value)}</div>
                    </div>
                )
            })}
        </div>;
    }

    render() {
        const { data, isVisible } = this.state;
        const { mainKey } = this.props;

        return <Modal
            isOpen={isVisible}
            title={data?.[mainKey]}
            content={this.renderModalContent(data)}
            footer={
                <Button 
                    variant="default" 
                    onClick={() => this.setState({ isVisible: false })}>
                    <span>Close</span>
                </Button>
            }
            onClose={() => this.handleCloseClick()}
        />
    }
}
/** @format */

/**
 * External dependencies
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import { hasTouch } from './touch-detect';
import WebPreviewContent from './content';

/**
 * Style dependencies
 */
import './style.scss';

export class WebPreviewModal extends Component {
	static propTypes = {
		// Display the preview
		showPreview: PropTypes.bool,
		// The URL that should be displayed in the iframe
		previewUrl: PropTypes.string,
		// The markup to display in the iframe
		previewMarkup: PropTypes.string,
		// The viewport device to show initially
		defaultViewportDevice: PropTypes.string,
		// Elements to render on the right side of the toolbar
		children: PropTypes.node,
		// The function to call when the iframe is loaded. Will be passed the iframe document object.
		// Only called if using previewMarkup.
		onLoad: PropTypes.func,
		// Called when the preview is closed, either via the 'X' button or the escape key
		onClose: PropTypes.func,
		// Called when the edit button is clicked
		onEdit: PropTypes.func,
		// Optional loading message to display during loading
		loadingMessage: PropTypes.string,
		// The iframe's title element, used for accessibility purposes
		iframeTitle: PropTypes.string,
		// Makes room for a sidebar if desired
		hasSidebar: PropTypes.bool,
		// The site/post description passed to the SeoPreviewPane
		frontPageMetaDescription: PropTypes.string,
		// A post object used to override the selected post in the SEO preview
		overridePost: PropTypes.object,
		// Called on mount and when previewShow changes
		onPreviewShowChange: PropTypes.func,
		// Element to wrap the preview component
		Wrapper: PropTypes.oneOfType( [ PropTypes.func, PropTypes.symbol ] ),
	};

	static defaultProps = {
		previewUrl: null,
		previewMarkup: null,
		onLoad: noop,
		onClose: noop,
		onEdit: noop,
		hasSidebar: false,
		overridePost: null,
		onPreviewShowChange: noop,
		Wrapper: Fragment,
	};

	constructor( props ) {
		super( props );

		this._hasTouch = false;

		this.state = {
			device: props.defaultViewportDevice || 'computer',
		};

		this.keyDown = this.keyDown.bind( this );
		this.setDeviceViewport = this.setDeviceViewport.bind( this );
	}

	componentWillMount() {
		// Cache touch and mobile detection for the entire lifecycle of the component
		this._hasTouch = hasTouch();
	}

	componentDidMount() {
		const { onPreviewShowChange, showPreview } = this.props;

		if ( showPreview ) {
			document.documentElement.classList.add( 'no-scroll', 'is-previewing' );
		}

		onPreviewShowChange( showPreview );
	}

	componentDidUpdate( prevProps ) {
		const { onPreviewShowChange, showPreview } = this.props;

		// add/remove listener if showPreview has changed
		if ( showPreview === prevProps.showPreview ) {
			return;
		}

		onPreviewShowChange( showPreview );

		if ( showPreview ) {
			window.addEventListener( 'keydown', this.keyDown );
			document.documentElement.classList.add( 'no-scroll', 'is-previewing' );
		} else {
			window.removeEventListener( 'keydown', this.keyDown );
			document.documentElement.classList.remove( 'no-scroll', 'is-previewing' );
		}
	}

	componentWillUnmount() {
		window.removeEventListener( 'keydown', this.keyDown );
		document.documentElement.classList.remove( 'no-scroll', 'is-previewing' );
	}

	keyDown( event ) {
		if ( event.keyCode === 27 ) {
			this.props.onClose();
			event.preventDefault();
		}
	}

	setDeviceViewport( device = 'computer' ) {
		this.setState( { device } );
	}

	render() {
		const {
			className,
			frontPageMetaDescription,
			hasSidebar,
			onClose,
			showPreview,
			Wrapper,
		} = this.props;
		const classes = classNames( className, 'web-preview', {
			'is-touch': this._hasTouch,
			'is-with-sidebar': hasSidebar,
			'is-visible': showPreview,
			'is-computer': this.state.device === 'computer',
			'is-tablet': this.state.device === 'tablet',
			'is-phone': this.state.device === 'phone',
			'is-seo': this.state.device === 'seo',
		} );

		return (
			<Wrapper>
				<div className={ classes }>
					{ /* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */ }
					<div className="web-preview__backdrop" onClick={ onClose } />
					{ /* eslint-enable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */ }
					<div className="web-preview__content">
						<WebPreviewContent
							{ ...this.props }
							onDeviceUpdate={ this.setDeviceViewport }
							isModalWindow={ true }
							frontPageMetaDescription={ frontPageMetaDescription || null }
						/>
					</div>
				</div>
			</Wrapper>
		);
	}
}

const WebPreviewInner = ( { isContentOnly, ...restProps } ) => {
	const WebPreviewComponent = isContentOnly ? WebPreviewContent : WebPreviewModal;

	return <WebPreviewComponent { ...restProps } />;
};

export default WebPreviewInner;
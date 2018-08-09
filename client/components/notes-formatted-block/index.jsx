/** @format */
/**
 * External dependencies
 */
import React from 'react';
import { startsWith } from 'lodash';

export const FormattedBlock = ( { content = {}, onClick = null } ) => {
	const {
		siteId,
		children,
		commentId,
		isTrashed,
		name,
		postId,
		text = null,
		type,
		section,
		siteSlug,
		pluginSlug,
		themeSlug,
		themeUri,
	} = content;

	if ( 'string' === typeof content ) {
		return content;
	}

	if ( undefined === type && ! children ) {
		return text;
	}

	const descent = children.map( ( child, key ) => (
		<FormattedBlock key={ key } content={ child } onClick={ onClick } />
	) );

	switch ( type ) {
		case 'a':
		case 'link':
			const url = startsWith( content.url, 'https://wordpress.com/' )
				? content.url.substr( 21 )
				: content.url;
			return (
				<a
					href={ url }
					onClick={ onClick }
					data-section={ onClick && section ? section : undefined }
				>
					{ descent }
				</a>
			);

		case 'b':
			return <strong>{ descent }</strong>;

		case 'comment':
			return (
				<a href={ `/read/blogs/${ siteId }/posts/${ postId }#comment-${ commentId }` }>
					{ descent }
				</a>
			);

		case 'filepath':
			return (
				<div>
					<code>{ descent }</code>
				</div>
			);

		case 'i':
			return <em>{ descent }</em>;

		case 'person':
			return (
				<a href={ `/people/edit/${ siteId }/${ name }` }>
					<strong>{ descent }</strong>
				</a>
			);

		case 'plugin':
			return (
				<a
					href={ `/plugins/${ pluginSlug }/${ siteSlug }` }
					onClick={ onClick }
					data-section="plugins"
				>
					{ descent }
				</a>
			);

		case 'post':
			return isTrashed ? (
				<a href={ `/posts/${ siteId }/trash` }>{ descent }</a>
			) : (
				<a href={ `/read/blogs/${ siteId }/posts/${ postId }` }>
					<em>{ descent }</em>
				</a>
			);

		case 'pre':
			return <pre>{ descent }</pre>;

		case 'theme':
			if ( ! themeUri ) {
				return descent;
			}

			if ( /wordpress\.com/.test( themeUri ) ) {
				return (
					<a
						href={ `/theme/${ themeSlug }/${ siteSlug }` }
						onClick={ onClick }
						data-section={ onClick ? 'themes' : undefined }
					>
						{ descent }
					</a>
				);
			}

			return (
				<a
					href={ themeUri }
					target="_blank"
					rel="noopener noreferrer"
					onClick={ onClick }
					data-section={ onClick ? 'themes-external' : undefined }
				>
					{ descent }
				</a>
			);

		default:
			return descent;
	}
};

export default FormattedBlock;

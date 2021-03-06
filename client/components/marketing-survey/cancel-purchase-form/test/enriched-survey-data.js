/**
 * Internal dependencies
 */
import enrichedSurveyData from '../enriched-survey-data';

jest.mock( 'lib/analytics', () => ( {} ) );

describe( 'enrichedSurveyData', () => {
	test( 'should duplicate survey data if no site or purchase are provided', () => {
		expect( enrichedSurveyData( { key: 'value' } ) ).toEqual( {
			key: 'value',
			purchase: null,
			purchaseId: null,
		} );
	} );

	test( 'should add purchase id and slug to survey data if purchase is provided', () => {
		const site = null;
		const purchase = { id: 'purchase id', productSlug: 'product slug' };
		expect( enrichedSurveyData( { key: 'value' }, site, purchase ).purchase ).toEqual(
			'product slug'
		);
	} );

	test( 'should add daysSincePurchase to survey data when purchase.subscribedDate is provided', () => {
		const site = null;
		const purchase = { subscribedDate: '2017-01-09T03:00:00+00:00' };
		expect(
			enrichedSurveyData( {}, site, purchase, '2017-01-19T03:00:00+00:00' ).daysSincePurchase
		).toEqual( 10 );
	} );

	test( 'should add daysSinceSiteCreation to survey data when site.options.created_at is provided', () => {
		const site = {
			options: { created_at: '2017-01-09T03:00:00+00:00' },
		};
		const purchase = null;
		expect(
			enrichedSurveyData( {}, site, purchase, '2017-01-19T03:00:00+00:00' ).daysSinceSiteCreation
		).toEqual( 10 );
	} );
} );

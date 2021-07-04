import Document, {DocumentContext, Head, Html, Main, NextScript} from 'next/document';
import React from 'react';
import { ServerStyleSheets } from '@material-ui/core/styles';

class MyDocument extends Document {

	static async getInitialProps(ctx: DocumentContext) {
		// Render app and page and get the context of the page with collected side effects.
		const sheets = new ServerStyleSheets();
		const originalRenderPage = ctx.renderPage;

		ctx.renderPage = () => originalRenderPage({
			enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
		});

		const initialProps = await Document.getInitialProps(ctx);

		return {
			...initialProps,
			// Styles fragment is rendered after the app and page rendering finish.
			styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
		};
	}


	render() {
		return (
			<Html lang="ru">
				<Head/>
				<body>
					<Main/>
					<NextScript/>
				</body>
			</Html>
		);
	}
}

export default MyDocument;

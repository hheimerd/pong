import Document, {DocumentContext, Head, Html, Main, NextScript} from 'next/document';
import React from 'react';


class MyDocument extends Document {

	static async getInitialProps(ctx: DocumentContext) {
		const ininitialProps = await Document.getInitialProps(ctx);
		return {...ininitialProps };
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

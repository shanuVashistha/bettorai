import Head from 'next/head';
import { useState } from 'react';
import axios from 'axios';

const API_KEY = process.env.API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

export default function Home () {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');

    const handleInputChange = (e: any) => {
        setQuery(e.target.value);
    };

    const extractFirstSentence = (text: any) => {
        return text.split('. ')[0];
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const { data } = await axios.get('https://www.googleapis.com/customsearch/v1', {
                params: {
                    key: API_KEY,
                    cx: SEARCH_ENGINE_ID,
                    q: query,
                    num: 1, // Retrieve only the first search result
                },
            });

            // Extract the search result
            const firstResult = data.items && data.items[0];

            if (firstResult) {
                const message = extractFirstSentence(firstResult.htmlSnippet);
                setResponse(message);
            } else {
                setResponse("Sorry, I couldn't find any relevant information.");
            }
        } catch (error: any) {
            console.error('Error:', error);
            setResponse('Oops! Something went wrong.');
        }
    };

    return (
        <>
            <Head>
                <title>Basketball News Chat Bot</title>
                <meta name="description" content="Basketball News Chat Bot"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div>
                <h1>Basketball News Chat Bot</h1>

                <form onSubmit={handleSubmit}>
                    <input type="text" value={query} onChange={handleInputChange}
                           style={{ width: 400, height: 50, padding: 10 }}/>
                    <button type="submit" style={{ padding: 10 }}>Search</button>
                </form>

                {response && (
                    <div>
                        <h2>Response:</h2>
                        <div dangerouslySetInnerHTML={{ __html: response }}></div>
                    </div>
                )}
            </div>
        </>
    );
}

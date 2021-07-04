import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Link } from '@material-ui/core';


export default function Index() {
    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Link href="/about" color="secondary">
                    Go to the about page
                </Link>
            </Box>
        </Container>
    );
}
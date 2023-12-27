import React from "react";
import Grid from '@mui/material/Grid';
import styles from "./Library.module.css";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Routes, Route, Link } from "react-router-dom";
import Overview from "./Overview/Overview";
import History from "./History/History";
import Likes from "./Likes/Likes";
import Following from "./Following/Following";
import Album from "./Album/Album";


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Library = () => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid item className={styles.panel}>
            <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '800px' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                        variant="fullWidth"
                        TabIndicatorProps={{
                            style: { backgroundColor: '#4CAF50' }  // 선택된 탭의 라벨 밑에 있는 줄의 색상
                        }}
                    >
                        <Tab label="개요" component={Link} to="" {...a11yProps(0)}
                            sx={{
                                '&.Mui-selected': {
                                    color: '#4CAF50',
                                    textDecoration: 'none', // 밑줄 제거
                                },
                                '&:hover': {
                                    color: '#4CAF50',
                                    textDecoration: 'none', // 밑줄 제거
                                },
                            }} />
                        <Tab label="좋아요" component={Link} to="likes" {...a11yProps(1)}
                         sx={{
                            '&.Mui-selected': {
                                color: '#4CAF50',
                                textDecoration: 'none', // 밑줄 제거
                            },
                            '&:hover': {
                                color: '#4CAF50',
                                textDecoration: 'none', // 밑줄 제거
                            },
                        }} />
                        <Tab label="앨범" component={Link} to="album" {...a11yProps(3)}
                         sx={{
                            '&.Mui-selected': {
                                color: '#4CAF50',
                                textDecoration: 'none', // 밑줄 제거
                            },
                            '&:hover': {
                                color: '#4CAF50',
                                textDecoration: 'none', // 밑줄 제거
                            },
                        }} />
                        <Tab label="팔로잉" component={Link} to="following" {...a11yProps(4)}
                         sx={{
                            '&.Mui-selected': {
                                color: '#4CAF50',
                                textDecoration: 'none', // 밑줄 제거
                            },
                            '&:hover': {
                                color: '#4CAF50',
                                textDecoration: 'none', // 밑줄 제거
                            },
                        }} />
                        <Tab label="최근 재생 목록" component={Link} to="history" {...a11yProps(5)}
                         sx={{
                            '&.Mui-selected': {
                                color: '#4CAF50',
                                textDecoration: 'none', // 밑줄 제거
                            },
                            '&:hover': {
                                color: '#4CAF50',
                                textDecoration: 'none', // 밑줄 제거
                            },
                        }} />
                    </Tabs>
                </Box>
                <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/likes" element={<Likes />} />
                    <Route path="/album" element={<Album />} />
                    <Route path="/following" element={<Following />} /> 
                    <Route path="/history" element={<History />} />
                </Routes>
            </Box>
        </Grid>
    );
}

export default Library;
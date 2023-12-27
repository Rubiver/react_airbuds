import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import styles from "./Mytracks.module.css";
import {
    AutoPlayContext,
    CurrentTrackContext,
    LoginContext,
    MusicContext,
    PlayingContext,
    TrackContext,
    TrackInfoContext,
} from "../../../App";
import { Link, useParams } from "react-router-dom";
import heart from "../assets/heart.svg";
import None_track_info from "../../Components/None_track_info";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const Mytracks = () => {
    const { targetID } = useParams();
    const [track, setTrack] = useState([]);
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { loginID, setLoginID } = useContext(LoginContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);
    const [trackPlayingStatus, setTrackPlayingStatus] = useState({});
    const [isFavorite, setFavorite] = useState(0);
    const [trackLike, setLike] = useState([]);
    const [trackCount, setTrackCount] = useState([]);

    useEffect(() => {
        axios.get(`/api/track/findById/${targetID}`).then((resp) => {
            const tracksWithImages = resp.data.map((track) => {
                const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
                return { ...track, imagePath };
            });
            console.log(tracksWithImages);
            setTrack(tracksWithImages);
        });
    }, [loginID]);

    const addStreamCount = (trackId, singerId, e) => {
        const formdata = new FormData();
        const date = new Date().toISOString();
        formdata.append("trackId", trackId);
        formdata.append("streamDate", date);
        formdata.append("streamSinger", singerId);
        axios.put(`/api/dashboard/addStream`, formdata).then(res => {

        }).catch((e) => {
            console.log(e);
        });
    }

    const addTrackToPlaylist = (track) => {

        axios.post(`/api/cplist`, {
            trackId: track.trackId,
            id: loginID
        }).then(resp => {
            addStreamCount(track.trackId, track.writeId);
        })

        setAutoPlayAfterSrcChange(true);

        // 트랙에서 관련 정보 추출
        const { trackId, filePath, imagePath, title, writer } = track;
        // TrackInfoContext를 선택한 트랙 정보로 업데이트
        setTrack_info({
            trackId,
            filePath,
            imagePath,
            title,
            writer,
        });

        setTracks((prevTracks) => [track, ...prevTracks]);

        setTrackPlayingStatus((prevStatus) => ({
            ...prevStatus,
            [track.trackId]: true,
        }));

        // 현재 트랙을 중지하고 새 트랙을 재생 목록에 추가하고 재생 시작
        setAudioFiles((prevAudioFiles) => [`/tracks/${filePath}`, ...prevAudioFiles]);
        setCurrentTrack(0);
        setIsPlaying(true);
    };

    const handleFavorite = (trackId, isLiked, e) => {
        if (loginID !== "") {
            if (!isLiked) {
                const formData = new FormData();
                formData.append("likeSeq", 0);
                formData.append("userId", loginID);
                formData.append("trackId", trackId);
                axios.post(`/api/like`, formData).then(res => {
                    setLike([...trackLike, { trackId: trackId, userId: loginID, likeSeq: res.data }]);
                    setFavorite(isFavorite + 1);
                    e.target.classList.add(styles.onClickHeart);
                    e.target.classList.remove(styles.NonClickHeart);
                }).catch((e) => {
                    console.log(e);
                });
            } else {
                const deleteData = new FormData();
                deleteData.append("trackId", trackId);
                deleteData.append("userId", loginID);
                axios.post(`/api/like/delete`, deleteData).then(res => {
                    const newLikeList = trackLike.filter(e => e.trackId !== trackId);
                    console.log("carousel delete", newLikeList);
                    setLike(newLikeList);
                    setFavorite(isFavorite + 1);
                    e.target.classList.remove(styles.onClickHeart);
                    e.target.classList.add(styles.NonClickHeart);
                }).catch((e) => {
                    console.log(e);
                });
            }
        } else {
            alert("좋아요는 로그인을 해야 합니다.")
            return;
        }
    }

    const getLikeCount = (trackId) => {
        const targetCount = trackCount.find(item => item.trackId === trackId);
        return targetCount ? targetCount.count : 0;
    };

    const loadingLikes = async () => {
        axios.get(`/api/like/${loginID}`).then(res => {
            console.log(res.data);
            setLike(res.data);
        }).catch((e) => {
            console.log(e);
        });

        axios.get(`/api/track/like_count/${targetID}`).then(res => {
            setTrackCount(res.data);
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        loadingLikes();
    }, [isFavorite]);

    return (
        <div className={styles.container}>
            {track.length === 0 ? (
                <None_track_info />
            ) : (
                track.map((track, index) => (
                    <div className={styles.track_info} key={index}>
                        <Link to={`/Detail/${track.trackId}`} className={styles.linkContainer}>
                            <div className={styles.track_image}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src={`/tracks/image/${track.imagePath}`}
                                    sx={{ width: '80px', height: '80px' }}
                                />
                            </div>
                            <div className={styles.track_title}>
                                <div>
                                    <Typography variant="h5" gutterBottom>
                                        {track.title}
                                    </Typography>
                                </div>
                                <div>
                                    {track.writer}
                                </div>
                            </div>
                        </Link>
                        <div className={styles.track_button}>
                            <div className={styles.play_button}
                                onClick={() => addTrackToPlaylist(track)}
                            >
                                <PlayCircleIcon sx={{ width: '60px', height: '60px' }} />
                            </div>
                            <div className={styles.track_duration}>
                                {formatDurationFromHHMMSS(track.duration)}
                            </div>
                            <div className={styles.like_share}>
                                <div className={styles.like}>
                                    <img
                                        src={heart}
                                        alt=""
                                        className={
                                            trackLike.some(trackLike => trackLike.trackId === track.trackId)
                                                ? styles.onClickHeart : styles.NonClickHeart}
                                        onClick={(e) => { handleFavorite(track.trackId, trackLike.some(trackLike => trackLike.trackId === track.trackId), e) }} />
                                    {" " + getLikeCount(track.trackId)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

};

const formatDurationFromHHMMSS = (duration) => {
    const [hours, minutes, seconds] = duration.split(':');
    return `${hours}:${minutes}:${seconds}`;
};

export default Mytracks;

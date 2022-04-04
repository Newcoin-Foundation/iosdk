import { Col, Row } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { ContentLayout } from "../../Components/ContentLayout";
import { ThreeDots } from "../../Components/Icons/ThreeDots";
import { ContentImage } from "../../Components/Image";
import { TopFoldersGrid } from "../../Components/TopFolders";
import { UserWidgetHeading } from "../../Components/UserWidget";
import {
	useCachedMood,
	useCachedMoodPosts,
	useCachedUser,
} from "../../hooks/useCached";
import { useAppState } from "../../overmind";
import { NLView } from "../../types";
import { MoodsGridRow } from "./MoodsGrid";

export const Mood: NLView = () => {
	const { moodId: id } = useParams<{ moodId: string }>();

	const mood = useCachedMoodPosts({ id }, true);
	const moodDetails = useCachedMood({ id }, true);

	const user = useCachedUser(mood.author);
	const state = useAppState();

	return (
		<div className="section-divider">
			<ContentLayout
				isWorking={!mood?.posts?.length}
				header={
					<>
						<Row
							style={{
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "40px",
							}}
						>
							<Col
								style={{
									alignItems: "center",
									display: "flex",
								}}
							>
								<span
									style={{
										marginRight: "10px",
										display: "flex",
									}}
								>
									{/* <LargeArrowBack /> */}
								</span>
								<Link
									to={`/user/${state.api.auth.user?.username}`}
									style={{ marginLeft: "10px" }}
								>
									<Avatar
										src={<ContentImage {...user} />}
										className="avatar-image-header"
									/>
								</Link>
								<Link
									to={`/user/${user.username}`}
									className="paragraph-1b"
									style={{ marginLeft: "20px" }}
								>
									{user.username}
								</Link>
							</Col>
							<Col
								style={{
									alignItems: "center",
									display: "flex",
								}}
							>
								<ThreeDots />
							</Col>
						</Row>
						<Row style={{ marginBottom: "40px" }}>
							<p className="paragraph-2b">{moodDetails.title}</p> 
							<p className="paragraph-2r">
								{ moodDetails.description || "" }
							</p>
							{/* {moodDetails.stakeToAccess} */}
						</Row>
					</>
				}
				isMood
			>
				{/* <UserWidgetHeading user={mood.author || {}} /> */}

				{/* <MoodsGridRow mood={mood} noFolder={true} wrap={true} /> */}
				<TopFoldersGrid
					mood={mood}
					noFolder={true}
					postNumber={3}
					title="Moods"
				/>
				{/* <ItemGrid items={postList} render={p => <PostWidget post={p} mood={mood} />} /> */}
			</ContentLayout>
		</div>
	);
};

export const MoodDetailed: NLView = () => {
	const { moodId: id } = useParams<{ moodId: string }>();
	const mood = useCachedMood({ id }, true);
	const user = useCachedUser(mood.author);
	return (
		<ContentLayout isWorking={!mood?.posts?.length}>
			{/* <UserWidgetHeading user={mood.author || {}} /> */}
			<h2 className="header-2">{mood.title}</h2>
			<Link to={`/user/${user.username}`}>{user.username}</Link>
			<p>{mood.description}</p>
			<br />
			<MoodsGridRow mood={mood} noFolder={true} wrap={true} />
			{/* <ItemGrid items={postList} render={p => <PostWidget post={p} mood={mood} />} /> */}
		</ContentLayout>
	);
};

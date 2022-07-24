import { SocialTypes } from "types";

const UserInfoTab = (user: SocialTypes.User) => {
  return (
    <section className="mb-10 flex flex-col gap-5">
      <p>User Info</p>
    </section>
  );
};
const UserFeedTab = () => {
  return (
    <section>
      <p>User Feed Content</p>
    </section>
  );
};
const UserTrackingsTab = () => {
  return (
    <section>
      <p>User Trackings Content</p>
    </section>
  );
};
const UserStatsTab = () => {
  return (
    <section>
      <p>User Stats Content</p>
    </section>
  );
};

export { UserInfoTab, UserFeedTab, UserTrackingsTab, UserStatsTab };

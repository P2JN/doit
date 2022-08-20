import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Cancel,
  CheckCircle,
  EmojiEvents,
  MilitaryTech,
  MilitaryTechOutlined,
} from "@mui/icons-material";

import { useActiveUser } from "store";
import { SocialTypes } from "types";

import { FollowButton, ProgressBar } from "components/molecules";
import { UserAvatar, UserUsername } from "components/organisms";
import { Card } from "components/atoms";

const LeaderboardTable = (props: {
  users: (SocialTypes.User & { amount: number })[];
  goalUnit: string;
  objective?: number;
}) => {
  const { activeUser } = useActiveUser();

  const getPosition = (user: SocialTypes.User & { amount: number }) => {
    switch (props.users.indexOf(user) + 1) {
      case 1:
        return <EmojiEvents fontSize="large" className="!fill-yellow-400" />;
      case 2:
        return <MilitaryTech fontSize="large" className="!fill-gray-300" />;
      case 3:
        return (
          <MilitaryTechOutlined fontSize="large" className="!fill-yellow-700" />
        );
      default:
        return props.users.indexOf(user) + 1;
    }
  };

  return (
    <TableContainer component={Card}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Posición</TableCell>
            <TableCell>Foto</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Progreso</TableCell>
            <TableCell align="center">Completado</TableCell>
            <TableCell align="center">Seguir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.users?.map((user) => {
            const isActiveUser = activeUser?.id === user?.id;
            return (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" scope="row" className="text-lg">
                  {getPosition(user)}
                </TableCell>
                <TableCell align="center" scope="row">
                  <UserAvatar {...user} />
                </TableCell>
                <TableCell scope="row">
                  <UserUsername {...user} />
                </TableCell>
                <TableCell>
                  <ProgressBar
                    objective={props.objective || 0}
                    completed={user.amount}
                    unit={props.goalUnit}
                  />
                </TableCell>
                <TableCell align="center">
                  {user.amount >= (props.objective || 0) ? (
                    <CheckCircle color="primary" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </TableCell>
                <TableCell align="center">
                  {!isActiveUser && <FollowButton {...user} />}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;

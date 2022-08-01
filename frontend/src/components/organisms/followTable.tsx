import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useActiveUser } from "store";
import { SocialTypes } from "types";

import { FollowButton } from "components/molecules";
import { UserAvatar, UserUsername } from "components/organisms";

const FollowTable = (props: { users: SocialTypes.User[] }) => {
  const { activeUser } = useActiveUser();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Foto</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell className="hidden md:block">Nombre</TableCell>
            <TableCell className="hidden md:block">Apellido</TableCell>
            <TableCell align="center">Seguir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.users?.map((user) => {
            const isActiveUser = activeUser?.id === user.id;
            return (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <UserAvatar {...user} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <UserUsername {...user} />
                </TableCell>
                <TableCell className="hidden md:block">
                  {user.firstName}
                </TableCell>
                <TableCell className="hidden md:block">
                  {user.lastName}
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

export default FollowTable;

import {setWith, TypedAction, TypedReducer} from "redoodle";
import {IUser, IUserWithLocalData} from "@devsession/common";
import {DeepPartial} from "@devsession/common";
import {mergeDeep} from "@devsession/common";
import {userColors} from "@devsession/common";

/*const colors = [
  '#2ecc71',
  '#3498db',
  '#e74c3c',
  '#8e44ad',
  '#f39c12',
  '#16a085',
  '#34495e'
];*/

export interface IUsersState {
  users: IUserWithLocalData[];
  colorCounter: number;
}

export const NewUser = TypedAction.define("@@users/new")<{
  userdata: IUser | IUserWithLocalData
}>();

export const UserChangedData = TypedAction.define("@@users/changed")<{
  userid: string;
  userdata: DeepPartial<IUser>;
}>();

export const UserLeft = TypedAction.define("@@users/left")<{
  userid: string;
}>();

const reducer = TypedReducer.builder<IUsersState>()
  .withHandler(NewUser.TYPE, (state, { userdata }) => {
    return setWith(state, {
      users: [...state.users, {
        ...userdata,
        color: userColors[state.colorCounter]
      }],
      colorCounter: (state.colorCounter + 1) % (userColors.length - 1)
    });
  })
  .withHandler(UserChangedData.TYPE, (state, { userid, userdata }) => {
    return setWith(state, {
      users: state.users.map(u => u.id === userid ? mergeDeep(u, userdata) : u)
    });
  })
  .withHandler(UserLeft.TYPE, (state, { userid }) => setWith(state, {
    users: state.users.filter(u => u.id !== userid)
  }))
  .build();

export default reducer;
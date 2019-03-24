import {Store} from "redoodle";
import {IState} from "../store";
import {SocketServer} from "../utils/socket";
import {SocketMessages} from "../types/communication";
import {NewUser, UserChangedData, UserLeft} from "../store/users";

export class SocketStoreBindingService {
  public static bindSocketMessagesToStore(store: Store<IState>) {
    SocketServer.on<SocketMessages.Users.NewUser>("@@USERS/NEW_USER", ({ userdata }) => {
      console.log(`New user arrived`, userdata);
      store.dispatch(NewUser.create({ userdata }))
    });

    SocketServer.on<SocketMessages.Users.UserLeft>("@@USERS/USER_LEFT", ({ user }) => {
      console.log(`User left`, user);
      store.dispatch(UserLeft.create({ userid: user }))
    });

    SocketServer.on<SocketMessages.Users.UserChangedData>("@@USERS/USER_CHANGED_DATA", ({ user, userdata }) => {
      console.log(`User changed data`, user, userdata);
      store.dispatch(UserChangedData.create({ userid: user, userdata }))
    });
  }
}
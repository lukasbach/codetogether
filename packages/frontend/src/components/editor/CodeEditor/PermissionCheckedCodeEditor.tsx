import * as React from "react";
import {Button, Colors, NonIdealState} from "@blueprintjs/core";
import {CodeEditorConnector, ICodeEditorConnectorProps} from "./CodeEditorConnector";
import {CalloutBar} from "../../common/CalloutBar/CalloutBar";
import {requestPathPermission} from "../../../utils/permissions";

export const PermissionCheckedCodeEditor: React.FunctionComponent<{
  editorProps: ICodeEditorConnectorProps;
}> = props => {
  if (!props.editorProps.activeFile) {
    return (
      <NonIdealState
          icon={'warning-sign'}
          title={'No file open'}
          description={'Open a file from the list on the left to start coding.'}
      />
    );
  }

  if (!props.editorProps.permissionData.mayRead) {
    return (
      <NonIdealState
        icon={'warning-sign'}
        title={'No read permission'}
        description={'You do not have the required permissions to view this file. You can request permissions for this ' +
        'specific file with the buttons below, or you can request permissions for an entire folder in the filelist ' +
        'on the left by right-clicking an item and requesting permissions from there.'}
        action={(
          <>
            <Button icon={'eye-open'} onClick={() => {
              requestPathPermission([props.editorProps.activeFile], props.editorProps.actingUser.id, {
                mayRead: true,
                mayWrite: false,
                mayDelete: false
              })
            }}>
              Request read permission
            </Button>
            <Button icon={'edit'} onClick={() => {
              requestPathPermission([props.editorProps.activeFile], props.editorProps.actingUser.id, {
                mayRead: true,
                mayWrite: true,
                mayDelete: false
              })
            }}>
              Request read and write permission
            </Button>
          </>
        )}
      />
    );
  }

  const noWriteError = (
    <CalloutBar
      intent={"warning"}
      text={'You do not have write permission on this file.'}
      icon={"warning-sign"}
      actions={[{
        text: 'Request write permission',
        icon: 'edit',
        onClick: () => {
          requestPathPermission([props.editorProps.activeFile], props.editorProps.actingUser.id, {
            mayRead: true,
            mayWrite: true,
            mayDelete: undefined
          });
        }
      }]}
    />
  );

  const editor = (
    <CodeEditorConnector
      {...props.editorProps}
    />
  );

  if (!props.editorProps.permissionData.mayWrite) {
    return (
      <div style={{height: '100%'}}>
        { noWriteError }
        { editor }
      </div>
    )
  } else {
    return editor;
  }
};

import {ReactElement} from "react";
import { Button as PaperButton } from "react-native-paper";

export default function Button({ children }): ReactElement {
  return <PaperButton mode="contained-tonal">{children}</PaperButton>;
}

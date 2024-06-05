import { ReactElement, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { View, Text, ToastAndroid, ScrollView } from "react-native";
import { Button, Icon, IconButton, TextInput } from "react-native-paper";
import { useCreateFloorMutation } from "features/registration/FloorSlice";

export function CreateFloor({ navigation }): React.ReactElement {
  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    watch,
    register,
  } = useForm({
    defaultValues: {
      floorName: "",
      numberOfRooms: 0,
      tasks: [{}],
      rooms: [],
    },
  });
  const [tasks, setTasks] = useState([{ id: Math.random() }]);
  const [rooms, setRooms] = useState<Array<React.ReactElement>>([]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });
  const {
    fields: fRooms,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control,
    name: "rooms",
  });
  const [createFloor, result] = useCreateFloorMutation();

  const addRooms = ({ control }): ReactElement => {
    const numberOfRooms = useWatch({ control, name: "numberOfRooms" });
    const roomsToAdd = Array<React.ReactElement>();
    if (!numberOfRooms) {
      return <>{rooms}</>;
    }
    if (numberOfRooms < rooms.length) {
      for (let i = numberOfRooms; i < rooms.length; i++) {
        removeRoom(i);
      }
      setRooms(rooms.slice(0, numberOfRooms));
    } else if (numberOfRooms > rooms.length) {
      for (let i = rooms.length; i < numberOfRooms; i++) {
        roomsToAdd.push(
          <Controller
            key={i}
            control={control}
            name={`rooms.${i}.number`}
            render={({ field }) => (
              <>
                <TextInput
                  label={`Room ${i + 1}`}
                  mode="outlined"
                  onChangeText={field.onChange}
                  value={field.value}
                  maxLength={16}
                  placeholder="enter room number or name"
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 3,
                    marginBottom: 5,
                  }}
                />
              </>
            )}
          />
        );
        appendRoom({ number: "" });
      }
      setRooms(rooms.concat(roomsToAdd));
    }
    return <>{rooms}</>;
  };

  const onSubmit = async (data) => {
    try {
      const { floorName, tasks, numberOfRooms, rooms } = data;
      const tasksArray = tasks.map((task, i) => ({
        id: i.toString(),
        name: task.taskName,
      }));
      const roomsArray = rooms
        .filter((room) => room.number != "")
        .map((room, i) => ({
          id: i.toString(),
          order: i + 1,
          number: room.number,
        }));
      const floor = {
        floorName,
        tasks: tasksArray,
        rooms: roomsArray,
      };
      await createFloor(floor)
        .unwrap()
        .then((payload) => {
          ToastAndroid.showWithGravity(
            "Floor created!",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
          );
          navigation.navigate("RegistrationForm", { floorId: payload.Id });
        });
    } catch (e) {
      console.error(e);
      ToastAndroid.showWithGravity(
        "An error occurred, please try again later.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    }
  };

  return (
    <ScrollView>
      <Controller
        control={control}
        defaultValue=""
        name="floorName"
        render={({ field }) => (
          <>
            <TextInput
              label="Floor name"
              mode="outlined"
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginTop: 3,
                marginBottom: 5,
              }}
              onChangeText={field.onChange}
              maxLength={16}
              placeholder="Floor name, e.g. 'Floor 1A'"
            />
          </>
        )}
      />
      {fields.map((t, i) => (
        <>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "left",
              alignItems: "center",
              paddingLeft: 10,
              paddingRight: 10,
              // marginTop: 25,
              // marginBottom: 15,
            }}
          >
            <Controller
              control={control}
              name={`tasks.${i}.taskName`}
              key={t.id}
              rules={{ required: true, maxLength: 32, minLength: 1 }}
              render={({ field }) => (
                <>
                  <TextInput
                    label={`Task ${i + 1} name`}
                    placeholder="enter task name"
                    mode="outlined"
                    style={{
                      width: "90%",
                    }}
                    onChangeText={field.onChange}
                    value={field.value}
                    maxLength={32}
                    key={t.id}
                  />
                </>
              )}
            />
            <IconButton
              icon="minus"
              style={{
                borderRadius: 20,
                borderWidth: 1,
              }}
              size={15}
              onPress={() => remove(i)}
            />
          </View>
          {errors.tasks && errors.tasks[i] && (
            <Text style={{ color: "red", paddingLeft: 10, paddingTop: 3 }}>
              Task name must not be empty
            </Text>
          )}
        </>
      ))}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <IconButton
          icon="plus"
          size={20}
          style={{
            borderRadius: 10,
            borderWidth: 1,
          }}
          onPress={() => append({ taskName: "" })}
        />
      </View>
      <Controller
        control={control}
        name="numberOfRooms"
        rules={{ required: true, max: 16, min: 1 }}
        render={({ field }) => (
          <>
            <TextInput
              label="Number of Rooms"
              mode="outlined"
              keyboardType="numeric"
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 5,
              }}
              maxLength={16}
              placeholder="Enter the number of rooms"
              onChangeText={field.onChange}
            />
            {errors.numberOfRooms && (
              <Text style={{ color: "red", paddingLeft: 10, paddingTop: 3 }}>
                Number of rooms must be greater than 0
              </Text>
            )}
          </>
        )}
      />
      {addRooms({ control })}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 5,
          marginTop: 20,
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        <Button
          mode="contained-tonal"
          style={{
            width: "48%",
          }}
          // disabled={true}
          onPress={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
        <Button
          mode="contained-tonal"
          style={{
            width: "48%",
          }}
          onPress={() => reset()}
        >
          Reset
        </Button>
      </View>
    </ScrollView>
  );
}

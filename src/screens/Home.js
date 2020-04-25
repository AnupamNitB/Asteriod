import React from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import {Button, Card, CardItem, Input, Item, List, ListItem} from 'native-base';
import * as APIS from './Constants';
import styles from '../../appStyles';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Asteroid_ID: '',
      IsDisabled: true,
      ShowRandomList: false,
      Asteroid_ID_Data: null,
      Asteroid_ID_List: [],
    };
  }
  /**function for handle textInput */

  handleChangeInput(itemValue) {
    this.state.Asteroid_ID = itemValue;
    this.state.IsDisabled = itemValue == '' ? true : false;
    this.setState({});
  }

  /**API Calling */

  asteriodApi(itemValue) {
    if (itemValue == 'random') {
      this.setState({
        ShowRandomList: true,
      });
      fetch(APIS.Random_Url)
        .then(response => {
          return response.json();
        })
        .then(responseJson => {
          if (responseJson != null) {
            let objects = responseJson.near_earth_objects;
            console.log(objects.length);
            let asteroid_ids = [];
            for (let i = 0; i < objects.length; i++) {
              asteroid_ids.push(
                <ListItem onPress={() => this.handleChangeInput(objects[i].id)}>
                  <Text>{objects[i].id}</Text>
                </ListItem>,
              );
            }
            this.setState({
              Asteroid_ID_Data: null,
              Asteroid_ID_List: asteroid_ids,
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      this.setState({
        ShowRandomList: false,
      });
      fetch(APIS.BASE_URL + this.state.Asteroid_ID + '?api_key=' + APIS.API_KEY)
        .then(response => {
          return response.status != 404 ? response.json() : null;
        })
        .then(responseJson => {
          let asteroid_id_data = [];
          if (responseJson != null) {
            asteroid_id_data.push(
              <View>
                <ListItem>
                  <Text>
                    styles name :{' '}
                    <Text style={styles.BoldText}>{responseJson.name}</Text>
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>
                    nasa_jpl_url :{' '}
                    <Text style={styles.BoldText}>
                      {responseJson.nasa_jpl_url}
                    </Text>
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>
                    is_potentially_hazardous_asteroid :{' '}
                    <Text style={styles.BoldText}>
                      {responseJson.is_potentially_hazardous_asteroid.toString()}
                    </Text>
                  </Text>
                </ListItem>
              </View>,
            );
          } else {
            asteroid_id_data.push(
              <View>
                <ListItem>
                  <Text>NO DATA FOUND</Text>
                </ListItem>
              </View>,
            );
          }
          this.setState({
            Asteroid_ID_List: [],
            Asteroid_ID_Data: asteroid_id_data,
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  render() {
    return (
      <View style={styles.Container}>
        <Card style={{flexGrow: 0.05}}>
          <CardItem>
            <Item>
              <Input
                style={styles.input}
                value={this.state.Asteroid_ID}
                placeholder="Enter Asteroid ID"
                onChangeText={value => this.handleChangeInput(value)}
              />
            </Item>
          </CardItem>
          <CardItem>
            <Button
              style={[
                this.state.IsDisabled
                  ? styles.DisableButton
                  : styles.EnableButton,
              ]}
              disabled={this.state.IsDisabled}
              onPress={() => this.asteriodApi('normal')}>
              <Text style={styles.ButtonText}>Submit</Text>
            </Button>
          </CardItem>
          <CardItem>
            <Button
              style={styles.EnableButton}
              onPress={() => this.asteriodApi('random')}>
              <Text style={styles.ButtonText}>Random Asteroid</Text>
            </Button>
          </CardItem>
        </Card>
        <Card style={{flex: 0.95}}>
          <SafeAreaView>
            <ScrollView>
              <List>
                {this.state.ShowRandomList
                  ? this.state.Asteroid_ID_List
                  : this.state.Asteroid_ID_Data}
              </List>
            </ScrollView>
          </SafeAreaView>
        </Card>
      </View>
    );
  }
}

export default Home;

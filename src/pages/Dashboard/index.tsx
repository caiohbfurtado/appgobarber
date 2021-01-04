import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { useAuth } from '../../hooks/auth';

// import { Container } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        style={{ backgroundColor: '#fff', padding: 15 }}
        onPress={() => signOut()}
      >
        <Text>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

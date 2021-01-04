import React, { useCallback, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import * as S from './styles';

import logoImg from '../../assets/logo.png';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const inputEmailRef = useRef<TextInput>(null);
  const inputPasswordRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório.'),
          email: Yup.string()
            .required('O e-mail é obrigatório.')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 digitos.'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('users', data);

        Alert.alert(
          'Cadastro realizado.',
          'Você já pode fazer seu logon no Go Barber!',
        );

        navigation.navigate('SignIn');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no cadastro.',
          'Ocorreu um erro ao realizar o cadastro do usuário. Cheque os dados e tente novamente.',
        );
      }
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <S.BackLogin onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#fff" />
            <S.BackLoginText>Voltar para logon</S.BackLoginText>
          </S.BackLogin>
          <S.Container>
            <Image source={logoImg} />

            <View>
              <S.Title>Crie sua conta</S.Title>
            </View>

            <Form
              onSubmit={handleSubmit}
              ref={formRef}
              style={{ width: '100%' }}
            >
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputEmailRef.current?.focus();
                }}
              />

              <Input
                ref={inputEmailRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCompleteType="email"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputPasswordRef.current?.focus();
                }}
              />

              <Input
                ref={inputPasswordRef}
                name="password"
                secureTextEntry
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Entrar
              </Button>
            </Form>
          </S.Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect } from 'expo-router';
import { tema } from '../constants/tema'

interface Livro {
  id: string;
  titulo: string;
  autor: string;
}

const catalogo = tema.cores.catalogo;

// Em vez de vários if/else dentro do renderItem, esta função devolve
// tudo o que muda no visual de acordo com o status do livro.
function obterVisual(status?: string) {
  switch (status) {
    case 'solicitado':
      return {
        rotulo: 'Solicitado',
        cor: catalogo.solicitado,
        textoBotao: 'Empréstimo Solicitado',
        ocupado: true,
      };
    case 'aprovado':
      return {
        rotulo: 'Emprestado',
        cor: catalogo.emprestado,
        textoBotao: 'Indisponível',
        ocupado: true,
      };
    case 'recusado':
      return {
        rotulo: 'Recusado (Disponível)',
        cor: catalogo.recusado,
        textoBotao: 'Solicitar Empréstimo',
        ocupado: false,
      };
    default:
      return {
        rotulo: 'Disponível',
        cor: catalogo.disponivel,
        textoBotao: 'Solicitar Empréstimo',
        ocupado: false,
      };
  }
}

export default function Index() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [usuarioId, setUsuarioId] = useState<string>('');
  // Mapeia { [idLivro]: status }
  const [statusEmprestimos, setStatusEmprestimos] = useState<{ [key: string]: string }>({});

  // Busca os dados do usuário
  async function buscarUsuario() {
    try {
      const resultado = await getDocs(collection(db, 'usuario'));
      resultado.forEach((documento) => {
        setUsuarioId(documento.id);
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  }

  // Busca os livros cadastrados
  async function buscarLivros() {
    try {
      const resultado = await getDocs(collection(db, 'livros'));
      const lista: Livro[] = [];
      resultado.forEach((documento) => {
        lista.push({
          id: documento.id,
          titulo: documento.data().Titulo || documento.data().titulo,
          autor: documento.data().Autor || documento.data().autor,
        });
      });
      setLivros(lista);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  }

  // Busca os empréstimos e mapeia o status de cada livro
  async function buscarEmprestimosFeitos() {
    try {
      let resultado = await getDocs(collection(db, 'emprestimo'));
      if (resultado.empty) {
        resultado = await getDocs(collection(db, 'emprestimos'));
      }

      const mapaStatus: { [key: string]: string } = {};

      resultado.forEach((doc) => {
        const data = doc.data();
        const idLivro = data.idLivro || data.livroId;
        const status = data.status || 'solicitado';

        if (idLivro) {
          mapaStatus[idLivro] = status;
        }
      });

      setStatusEmprestimos(mapaStatus);
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error);
    }
  }

  // Solicita empréstimo e atualiza o estado imediatamente
  async function solicitarEmprestimo(livro: Livro) {
    if (!usuarioId) {
      Alert.alert('Erro', 'Usuário não encontrado no banco!');
      return;
    }

    try {
      await addDoc(collection(db, 'emprestimo'), {
        idLivro: livro.id,
        idUsuario: usuarioId,
        tituloLivro: livro.titulo,
        autorLivro: livro.autor,
        dataEmprestimo: new Date(),
        status: 'solicitado',
      });

      Alert.alert('Sucesso', `Empréstimo do livro "${livro.titulo}" solicitado!`);

      setStatusEmprestimos((prev) => ({
        ...prev,
        [livro.id]: 'solicitado',
      }));
    } catch (error) {
      console.error('Erro ao solicitar empréstimo:', error);
      Alert.alert('Erro', 'Não foi possível registrar o empréstimo.');
    }
  }

  // Atualiza tudo toda vez que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      buscarUsuario();
      buscarLivros();
      buscarEmprestimosFeitos();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.tituloHeader}>Catálogo de Livros</Text>
        <Text style={styles.subtitulo}>
          {livros.length === 1 ? '1 livro cadastrado' : `${livros.length} livros cadastrados`}
        </Text>
      </View>

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const visual = obterVisual(statusEmprestimos[item.id]);

          return (
            <View style={styles.card}>
              <View style={[styles.faixa, { backgroundColor: visual.cor.faixa }]} />

              <View style={styles.cardConteudo}>
                <Text style={styles.tituloLivro}>{item.titulo}</Text>
                <Text style={styles.autorLivro}>por {item.autor}</Text>

                <View style={[styles.pilula, { backgroundColor: visual.cor.fundo }]}>
                  <Text style={[styles.pilulaTexto, { color: visual.cor.texto }]}>
                    {visual.rotulo.toUpperCase()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.botao, visual.ocupado && styles.botaoDesabilitado]}
                  onPress={() => solicitarEmprestimo(item)}
                  disabled={visual.ocupado}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textoBotao}>{visual.textoBotao}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tema.cores.fundo,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  cabecalho: { marginBottom: 20 },
  tituloHeader: {
    fontSize: 28,
    fontWeight: '800',
    color: tema.cores.primaria,
  },
  subtitulo: {
    fontSize: 14,
    color: tema.cores.textoSecundario,
    marginTop: 4,
  },
  // Espaço no final para a lista não ficar atrás da barra de abas flutuante
  lista: { paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    backgroundColor: tema.cores.superficie,
    borderRadius: tema.raio.cartao,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tema.cores.borda,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  faixa: { width: 6 },
  cardConteudo: { flex: 1, padding: 16 },
  tituloLivro: {
    fontSize: 17,
    fontWeight: '700',
    color: tema.cores.texto,
  },
  autorLivro: {
    fontSize: 14,
    color: tema.cores.textoSecundario,
    marginTop: 4,
    marginBottom: 12,
  },
  pilula: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: tema.raio.pilula,
  },
  pilulaTexto: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  botao: {
    backgroundColor: tema.cores.primaria,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  botaoDesabilitado: { backgroundColor: tema.cores.botaoDesabilitado },
  textoBotao: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
});
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect } from 'expo-router';
import { CORES } from '../constants/cores';

interface Solicitacao {
  id: string;
  livroId: string;
  tituloLivro: string;
  usuarioId: string;
  status: string;
}

export default function TelaAprovacaoADM() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [aba, setAba] = useState<'pendentes' | 'historico'>('pendentes');

  async function carregarSolicitacoes() {
    try {
      let snap = await getDocs(collection(db, 'emprestimo'));

      if (snap.empty) {
        snap = await getDocs(collection(db, 'emprestimos'));
      }

      const lista: Solicitacao[] = [];
      snap.forEach((d) => {
        const data = d.data();
        lista.push({
          id: d.id,
          livroId: data.idLivro || data.livroId || '',
          tituloLivro: data.tituloLivro || 'Sem título',
          usuarioId: data.idUsuario || data.usuarioId || '',
          status: data.status || 'solicitado',
        });
      });

      setSolicitacoes(lista);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    }
  }

  async function aprovarSolicitacao(item: Solicitacao) {
    try {
      await updateDoc(doc(db, 'emprestimo', item.id), { status: 'aprovado' });

      if (item.livroId) {
        await updateDoc(doc(db, 'livros', item.livroId), { status: 1 });
      }

      Alert.alert('Sucesso', 'Empréstimo Aprovado!');
      carregarSolicitacoes();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao aprovar empréstimo.');
    }
  }

  async function recusarSolicitacao(item: Solicitacao) {
    try {
      await updateDoc(doc(db, 'emprestimo', item.id), { status: 'recusado' });

      if (item.livroId) {
        await updateDoc(doc(db, 'livros', item.livroId), { status: 0 });
      }

      Alert.alert('Sucesso', 'Empréstimo Recusado!');
      carregarSolicitacoes();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao recusar empréstimo.');
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      carregarSolicitacoes();
    }, [])
  );

  const pendentes = solicitacoes.filter(
    (item) => item.status === 'solicitado' || item.status === 'pendente'
  );

  const finalizados = solicitacoes.filter(
    (item) => item.status === 'aprovado' || item.status === 'recusado'
  );

  const totalAprovados = finalizados.filter((i) => i.status === 'aprovado').length;
  const totalRecusados = finalizados.length - totalAprovados;

  function inicial(titulo: string) {
    return titulo.trim().charAt(0).toUpperCase() || '?';
  }

  function renderPendente({ item }: { item: Solicitacao }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardTopo}>
          <View style={styles.capa}>
            <Text style={[styles.capaLetra, { color: CORES.primaria }]}>
              {inicial(item.tituloLivro)}
            </Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.livro} numberOfLines={2}>
              {item.tituloLivro}
            </Text>
            <Text style={styles.subtexto} numberOfLines={1}>
              Usuário: {item.usuarioId}
            </Text>
          </View>
        </View>

        <View style={styles.botoes}>
          <TouchableOpacity
            style={[styles.botao, styles.botaoRecusar]}
            onPress={() => recusarSolicitacao(item)}
            activeOpacity={0.85}
          >
            <Text style={[styles.textoBotao, { color: CORES.erro }]}>Recusar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, styles.botaoAprovar]}
            onPress={() => aprovarSolicitacao(item)}
            activeOpacity={0.85}
          >
            <Text style={[styles.textoBotao, { color: '#fff' }]}>Aprovar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderHistorico({ item }: { item: Solicitacao }) {
    const isAprovado = item.status === 'aprovado';
    const corFundo = isAprovado ? CORES.sucessoClara : CORES.erroClara;
    const corTexto = isAprovado ? CORES.sucesso : CORES.erro;

    return (
      <View style={styles.card}>
        <View style={styles.cardTopo}>
          <View style={[styles.capa, { backgroundColor: corFundo }]}>
            <Text style={[styles.capaLetra, { color: corTexto }]}>
              {inicial(item.tituloLivro)}
            </Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.livro} numberOfLines={2}>
              {item.tituloLivro}
            </Text>
            <Text style={styles.subtexto} numberOfLines={1}>
              Usuário: {item.usuarioId}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: corFundo }]}>
            <Text style={[styles.badgeTexto, { color: corTexto }]}>
              {isAprovado ? 'Aprovado' : 'Recusado'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const listaAtual = aba === 'pendentes' ? pendentes : finalizados;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloHeader}>Empréstimos</Text>
        <Text style={styles.subtituloHeader}>Painel do administrador</Text>

        <View style={styles.resumo}>
          <View style={styles.resumoItem}>
            <Text style={styles.resumoNumero}>{pendentes.length}</Text>
            <Text style={styles.resumoRotulo}>Pendentes</Text>
          </View>
          <View style={styles.resumoDivisor} />
          <View style={styles.resumoItem}>
            <Text style={styles.resumoNumero}>{totalAprovados}</Text>
            <Text style={styles.resumoRotulo}>Aprovados</Text>
          </View>
          <View style={styles.resumoDivisor} />
          <View style={styles.resumoItem}>
            <Text style={styles.resumoNumero}>{totalRecusados}</Text>
            <Text style={styles.resumoRotulo}>Recusados</Text>
          </View>
        </View>
      </View>

      <View style={styles.seletor}>
        <TouchableOpacity
          style={[styles.aba, aba === 'pendentes' && styles.abaAtiva]}
          onPress={() => setAba('pendentes')}
        >
          <Text style={[styles.abaTexto, aba === 'pendentes' && styles.abaTextoAtivo]}>
            Pendentes ({pendentes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.aba, aba === 'historico' && styles.abaAtiva]}
          onPress={() => setAba('historico')}
        >
          <Text style={[styles.abaTexto, aba === 'historico' && styles.abaTextoAtivo]}>
            Histórico ({finalizados.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listaAtual}
        keyExtractor={(item) => item.id}
        renderItem={aba === 'pendentes' ? renderPendente : renderHistorico}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {aba === 'pendentes'
              ? 'Nenhuma solicitação pendente.'
              : 'Nenhum empréstimo finalizado.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  header: {
    backgroundColor: CORES.escura,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  tituloHeader: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  subtituloHeader: {
    fontSize: 13,
    color: '#A5B4FC',
    marginTop: 2,
    marginBottom: 20,
  },
  resumo: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    paddingVertical: 14,
  },
  resumoItem: {
    flex: 1,
    alignItems: 'center',
  },
  resumoNumero: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  resumoRotulo: {
    fontSize: 12,
    color: '#C7D2FE',
    marginTop: 2,
  },
  resumoDivisor: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  seletor: {
    flexDirection: 'row',
    backgroundColor: '#E8E9F7',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 6,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  abaAtiva: {
    backgroundColor: CORES.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  abaTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textoSuave,
  },
  abaTextoAtivo: {
    color: CORES.escura,
    fontWeight: '700',
  },
  lista: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 120,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 50,
    color: CORES.textoSuave,
    fontSize: 14,
  },
  card: {
    backgroundColor: CORES.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: CORES.escura,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  capa: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: CORES.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capaLetra: {
    fontSize: 20,
    fontWeight: '800',
  },
  cardInfo: {
    flex: 1,
  },
  livro: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.texto,
  },
  subtexto: {
    fontSize: 12,
    color: CORES.textoSuave,
    marginTop: 3,
  },
  botoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  botao: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoAprovar: {
    backgroundColor: CORES.sucesso,
  },
  botaoRecusar: {
    backgroundColor: CORES.erroClara,
  },
  textoBotao: {
    fontWeight: '700',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeTexto: {
    fontWeight: '700',
    fontSize: 12,
  },
});
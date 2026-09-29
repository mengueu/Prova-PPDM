import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect } from 'expo-router';
import { tema } from '../constants/cores';

interface ItemEmprestimo {
  id: string;
  tituloLivro: string;
  autorLivro: string;
  status: string;
}

const rotulosStatus: Record<string, string> = {
  solicitado: 'Solicitado',
  aprovado: 'Aprovado',
  recusado: 'Recusado',
};

export default function EmprestimosScreen() {
  const [emprestimos, setEmprestimos] = useState<ItemEmprestimo[]>([]);

  async function carregarEmprestimos() {
    try {
      let resultado = await getDocs(collection(db, 'emprestimo'));
      if (resultado.empty) {
        resultado = await getDocs(collection(db, 'emprestimos'));
      }

      const lista: ItemEmprestimo[] = [];

      resultado.forEach((documento) => {
        const dados = documento.data();
        lista.push({
          id: documento.id,
          // O Firebase permite documentos com campos faltando, então sempre
          // usamos um valor padrão para o app não quebrar.
          tituloLivro: dados.tituloLivro || 'Livro Sem Título',
          autorLivro: dados.autorLivro || 'Autor Não Informado',
          status: dados.status || 'solicitado',
        });
      });

      setEmprestimos(lista);
    } catch (error) {
      console.error('Erro ao carregar lista de empréstimos:', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      carregarEmprestimos();
    }, [])
  );

  const coresStatus = tema.cores.status;

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.tituloHeader}>Meus Empréstimos</Text>
        <Text style={styles.subtitulo}>
          {emprestimos.length === 1
            ? '1 solicitação'
            : `${emprestimos.length} solicitações`}
        </Text>
      </View>

      {emprestimos.length === 0 ? (
        <View style={styles.vazioCaixa}>
          <Text style={styles.vazioTitulo}>Nada por aqui ainda</Text>
          <Text style={styles.vazioTexto}>
            Você ainda não solicitou empréstimos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={emprestimos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const cor =
              coresStatus[item.status as keyof typeof coresStatus] ??
              coresStatus.solicitado;
            const rotulo = rotulosStatus[item.status] ?? 'Solicitado';

            return (
              <View style={styles.card}>
                <View style={[styles.faixa, { backgroundColor: cor.faixa }]} />
                <View style={styles.cardConteudo}>
                  <Text style={styles.tituloLivro}>{item.tituloLivro}</Text>
                  <Text style={styles.autorLivro}>por {item.autorLivro}</Text>
                  <View style={[styles.pilula, { backgroundColor: cor.fundo }]}>
                    <Text style={[styles.pilulaTexto, { color: cor.texto }]}>
                      {rotulo.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
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
  // Espaço no final para a lista não ficar escondida atrás da barra flutuante
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
  vazioCaixa: {
    backgroundColor: tema.cores.superficie,
    borderRadius: tema.raio.cartao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
  },
  vazioTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: tema.cores.primaria,
    marginBottom: 6,
  },
  vazioTexto: {
    fontSize: 14,
    color: tema.cores.textoSecundario,
    textAlign: 'center',
  },
});
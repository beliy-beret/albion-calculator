import React, { useState } from 'react';
import {
  Card,
  Form,
  InputNumber,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
  Divider,
  Space,
  Tag,
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const HERBS = {
  T2: 'Agaric (Мухомор)',
  T3: 'Teasel (Ворсянка)',
  T4: 'Burdock (Лопух)',
  T5: 'Muellin (Коровяк)',
  T6: 'Yarrow (Тысячелистник)',
  T7: 'Foxglove (Наперстянка)',
  T8: 'Demon\'s Blood (Кровь демона)',
};

// Рецепты зелий (на 1 порцию зелья)
// primaryHerbAmount  — кол-во основной травы текущего тира
// secondaryHerbAmount — кол-во вспомогательной травы предыдущего тира
// outputAmount — кол-во зелий на выходе
const POTION_TYPES = {
  HEALING: {
    name: 'Зелье лечения',
    emoji: '❤️',
    color: '#ff4d4f',
    description: 'Восстанавливает здоровье',
    tiers: {
      T2: { primaryAmount: 2, secondaryTier: null, secondaryAmount: 0, outputAmount: 1 },
      T3: { primaryAmount: 2, secondaryTier: 'T2', secondaryAmount: 1, outputAmount: 1 },
      T4: { primaryAmount: 2, secondaryTier: 'T3', secondaryAmount: 1, outputAmount: 1 },
      T5: { primaryAmount: 2, secondaryTier: 'T4', secondaryAmount: 1, outputAmount: 1 },
      T6: { primaryAmount: 2, secondaryTier: 'T5', secondaryAmount: 1, outputAmount: 1 },
      T7: { primaryAmount: 2, secondaryTier: 'T6', secondaryAmount: 1, outputAmount: 1 },
      T8: { primaryAmount: 2, secondaryTier: 'T7', secondaryAmount: 1, outputAmount: 1 },
    }
  },
  ENERGY: {
    name: 'Зелье энергии',
    emoji: '⚡',
    color: '#faad14',
    description: 'Восстанавливает ману / энергию',
    tiers: {
      T2: { primaryAmount: 2, secondaryTier: null, secondaryAmount: 0, outputAmount: 1 },
      T3: { primaryAmount: 2, secondaryTier: 'T2', secondaryAmount: 1, outputAmount: 1 },
      T4: { primaryAmount: 2, secondaryTier: 'T3', secondaryAmount: 1, outputAmount: 1 },
      T5: { primaryAmount: 2, secondaryTier: 'T4', secondaryAmount: 1, outputAmount: 1 },
      T6: { primaryAmount: 2, secondaryTier: 'T5', secondaryAmount: 1, outputAmount: 1 },
      T7: { primaryAmount: 2, secondaryTier: 'T6', secondaryAmount: 1, outputAmount: 1 },
      T8: { primaryAmount: 2, secondaryTier: 'T7', secondaryAmount: 1, outputAmount: 1 },
    }
  },
  RESISTANCE: {
    name: 'Зелье сопротивления',
    emoji: '🛡️',
    color: '#1677ff',
    description: 'Снимает дебаффы, повышает сопротивление',
    tiers: {
      T2: { primaryAmount: 3, secondaryTier: null, secondaryAmount: 0, outputAmount: 1 },
      T3: { primaryAmount: 3, secondaryTier: 'T2', secondaryAmount: 1, outputAmount: 1 },
      T4: { primaryAmount: 3, secondaryTier: 'T3', secondaryAmount: 1, outputAmount: 1 },
      T5: { primaryAmount: 3, secondaryTier: 'T4', secondaryAmount: 1, outputAmount: 1 },
      T6: { primaryAmount: 3, secondaryTier: 'T5', secondaryAmount: 1, outputAmount: 1 },
      T7: { primaryAmount: 3, secondaryTier: 'T6', secondaryAmount: 1, outputAmount: 1 },
      T8: { primaryAmount: 3, secondaryTier: 'T7', secondaryAmount: 1, outputAmount: 1 },
    }
  },
  GIGANTIFY: {
    name: 'Зелье гиганта',
    emoji: '💪',
    color: '#52c41a',
    description: 'Увеличивает размер и силу удара',
    tiers: {
      T4: { primaryAmount: 3, secondaryTier: 'T3', secondaryAmount: 1, outputAmount: 1 },
      T5: { primaryAmount: 3, secondaryTier: 'T4', secondaryAmount: 1, outputAmount: 1 },
      T6: { primaryAmount: 3, secondaryTier: 'T5', secondaryAmount: 1, outputAmount: 1 },
      T7: { primaryAmount: 3, secondaryTier: 'T6', secondaryAmount: 1, outputAmount: 1 },
      T8: { primaryAmount: 3, secondaryTier: 'T7', secondaryAmount: 1, outputAmount: 1 },
    }
  },
  INVISIBILITY: {
    name: 'Зелье невидимости',
    emoji: '👁️',
    color: '#722ed1',
    description: 'Временно делает невидимым',
    tiers: {
      T4: { primaryAmount: 4, secondaryTier: 'T3', secondaryAmount: 2, outputAmount: 1 },
      T5: { primaryAmount: 4, secondaryTier: 'T4', secondaryAmount: 2, outputAmount: 1 },
      T6: { primaryAmount: 4, secondaryTier: 'T5', secondaryAmount: 2, outputAmount: 1 },
      T7: { primaryAmount: 4, secondaryTier: 'T6', secondaryAmount: 2, outputAmount: 1 },
      T8: { primaryAmount: 4, secondaryTier: 'T7', secondaryAmount: 2, outputAmount: 1 },
    }
  },
};

const PotionCraftingCalculator = () => {
  const [form] = Form.useForm();
  const [results, setResults] = useState(null);
  const [selectedType, setSelectedType] = useState('HEALING');
  const [selectedTier, setSelectedTier] = useState('T4');

  const getAvailableTiers = (potionType) => {
    return Object.keys(POTION_TYPES[potionType].tiers);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    const tiers = getAvailableTiers(type);
    const currentTier = form.getFieldValue('potionTier');
    if (!tiers.includes(currentTier)) {
      form.setFieldValue('potionTier', tiers[0]);
      setSelectedTier(tiers[0]);
    }
  };

  const handleTierChange = (tier) => {
    setSelectedTier(tier);
  };

  const calculateCrafting = (values) => {
    const {
      potionType,
      potionTier,
      primaryHerbAmount,
      secondaryHerbAmount = 0,
      returnRate = 15.2,
      primaryHerbPrice = 0,
      secondaryHerbPrice = 0,
      craftingCost = 0,
      sellPrice = 0,
    } = values;

    const potionInfo = POTION_TYPES[potionType];
    const recipe = potionInfo.tiers[potionTier];
    const returnRateDecimal = returnRate / 100;

    const effectivePrimaryNeeded = recipe.primaryAmount * (1 - returnRateDecimal);
    const effectiveSecondaryNeeded = recipe.secondaryAmount * (1 - returnRateDecimal);

    let maxPotions = Math.floor(primaryHerbAmount / effectivePrimaryNeeded);

    if (recipe.secondaryTier && recipe.secondaryAmount > 0) {
      const maxFromSecondary = Math.floor(secondaryHerbAmount / effectiveSecondaryNeeded);
      maxPotions = Math.min(maxPotions, maxFromSecondary);
    }

    const totalPotions = maxPotions * recipe.outputAmount;

    const primaryUsed = maxPotions * effectivePrimaryNeeded;
    const secondaryUsed = maxPotions * effectiveSecondaryNeeded;
    const primaryRemaining = primaryHerbAmount - primaryUsed;
    const secondaryRemaining = secondaryHerbAmount - secondaryUsed;

    const primaryReturned = maxPotions * recipe.primaryAmount * returnRateDecimal;
    const secondaryReturned = maxPotions * recipe.secondaryAmount * returnRateDecimal;

    const totalPrimaryCost = Math.ceil(primaryUsed) * primaryHerbPrice;
    const totalSecondaryCost = Math.ceil(secondaryUsed) * secondaryHerbPrice;
    const totalCraftingCost = craftingCost * maxPotions;
    const totalCost = totalPrimaryCost + totalSecondaryCost + totalCraftingCost;
    const costPerPotion = totalPotions > 0 ? totalCost / totalPotions : 0;

    const totalRevenue = totalPotions * sellPrice;
    const profit = totalRevenue - totalCost;
    const profitPerPotion = totalPotions > 0 ? profit / totalPotions : 0;
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

    setResults({
      maxPotions,
      totalPotions,
      primaryUsed: Math.ceil(primaryUsed),
      primaryRemaining: Math.floor(primaryRemaining),
      primaryReturned: Math.floor(primaryReturned),
      secondaryUsed: Math.ceil(secondaryUsed),
      secondaryRemaining: Math.floor(secondaryRemaining),
      secondaryReturned: Math.floor(secondaryReturned),
      totalPrimaryCost,
      totalSecondaryCost,
      totalCraftingCost,
      totalCost,
      costPerPotion,
      totalRevenue,
      profit,
      profitPerPotion,
      profitMargin,
      potionInfo,
      recipe,
      potionTier,
    });
  };

  const currentRecipe = POTION_TYPES[selectedType]?.tiers[selectedTier];
  const primaryHerbName = HERBS[selectedTier] || '';
  const secondaryHerbName = currentRecipe?.secondaryTier ? HERBS[currentRecipe.secondaryTier] : '';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Card
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          ⚗️ Калькулятор крафта зелий
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Параметры крафта" size="small">
              <Form
                form={form}
                layout="vertical"
                onFinish={calculateCrafting}
                initialValues={{
                  potionType: 'HEALING',
                  potionTier: 'T4',
                  primaryHerbAmount: 200,
                  secondaryHerbAmount: 100,
                  returnRate: 15.2,
                  primaryHerbPrice: 100,
                  secondaryHerbPrice: 50,
                  craftingCost: 5,
                  sellPrice: 0,
                }}
              >
                <Form.Item
                  name="potionType"
                  label="Тип зелья"
                  tooltip="Выберите тип зелья для крафта"
                >
                  <Select onChange={handleTypeChange}>
                    {Object.entries(POTION_TYPES).map(([key, data]) => (
                      <Option key={key} value={key}>
                        {data.emoji} {data.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="potionTier"
                  label="Тир зелья"
                  tooltip="Выберите уровень зелья"
                >
                  <Select onChange={handleTierChange}>
                    {getAvailableTiers(selectedType).map((tier) => (
                      <Option key={tier} value={tier}>
                        {tier} — {HERBS[tier]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {currentRecipe && (
                  <Alert
                    style={{ marginBottom: 16 }}
                    message={
                      <Text>
                        Рецепт: <strong>{currentRecipe.primaryAmount}x {primaryHerbName}</strong>
                        {currentRecipe.secondaryTier && (
                          <> + <strong>{currentRecipe.secondaryAmount}x {secondaryHerbName}</strong></>
                        )}
                        {' '}→ <strong>{currentRecipe.outputAmount} зелье</strong>
                      </Text>
                    }
                    type="info"
                  />
                )}

                <Form.Item
                  name="primaryHerbAmount"
                  label={`Количество: ${primaryHerbName}`}
                  rules={[{ required: true, message: 'Введите количество основной травы' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Например: 200"
                  />
                </Form.Item>

                {currentRecipe?.secondaryTier && (
                  <Form.Item
                    name="secondaryHerbAmount"
                    label={`Количество: ${secondaryHerbName}`}
                    tooltip={`Вспомогательная трава ${currentRecipe.secondaryTier} тира`}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      placeholder="Например: 100"
                    />
                  </Form.Item>
                )}

                <Form.Item
                  name="returnRate"
                  label="Процент возврата ресурсов (%)"
                  tooltip="Базовый: 15.2%. Увеличивается с уровнем специализации и Crafting Focus"
                >
                  <InputNumber
                    min={0}
                    max={50}
                    step={0.1}
                    style={{ width: '100%' }}
                    placeholder="15.2"
                  />
                </Form.Item>

                <Divider orientation="left" style={{ margin: '16px 0' }}>
                  <Text strong>💰 Экономические параметры</Text>
                </Divider>

                <Form.Item
                  name="primaryHerbPrice"
                  label={`Цена: ${primaryHerbName}`}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="100"
                    addonAfter="серебра"
                  />
                </Form.Item>

                {currentRecipe?.secondaryTier && (
                  <Form.Item
                    name="secondaryHerbPrice"
                    label={`Цена: ${secondaryHerbName}`}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      placeholder="50"
                      addonAfter="серебра"
                    />
                  </Form.Item>
                )}

                <Form.Item
                  name="craftingCost"
                  label="Стоимость крафта (налог станка)"
                  tooltip="Стоимость одного крафта — налоги за использование Alchemist's Lab"
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="5"
                    addonAfter="серебра"
                  />
                </Form.Item>

                <Form.Item
                  name="sellPrice"
                  label="Цена продажи зелья"
                  tooltip="Укажите цену продажи для расчёта прибыли (необязательно)"
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="0"
                    addonAfter="серебра"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ width: '100%' }}
                  >
                    Рассчитать
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            {results && (
              <Card title="Результаты расчета" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Alert
                    message={
                      <Text>
                        {results.potionInfo.emoji} Можно создать:{' '}
                        <strong>{results.totalPotions}</strong> зелий{' '}
                        <Tag color={results.potionInfo.color}>{results.potionInfo.name}</Tag>{' '}
                        {results.potionTier}
                      </Text>
                    }
                    type="success"
                    showIcon
                  />

                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="Всего зелий"
                        value={results.totalPotions}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Себестоимость"
                        value={results.costPerPotion.toFixed(1)}
                        suffix="сер."
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title={results.profit >= 0 ? 'Прибыль' : 'Убыток'}
                        value={Math.abs(results.profitPerPotion).toFixed(1)}
                        suffix="сер./шт."
                        valueStyle={{ color: results.profit >= 0 ? '#3f8600' : '#cf1322' }}
                      />
                    </Col>
                  </Row>

                  <Divider orientation="left">Использовано трав</Divider>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Основная трава: </Text>
                      <Text>{results.primaryUsed}</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Возврат: </Text>
                      <Text type="success">+{results.primaryReturned}</Text>
                    </Col>
                  </Row>

                  {results.recipe.secondaryTier && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text strong>Вспомогательная: </Text>
                        <Text>{results.secondaryUsed}</Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Возврат: </Text>
                        <Text type="success">+{results.secondaryReturned}</Text>
                      </Col>
                    </Row>
                  )}

                  <Divider orientation="left">💰 Экономический расчет</Divider>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Стоимость трав: </Text>
                      <Text>{(results.totalPrimaryCost + results.totalSecondaryCost).toFixed(0)} серебра</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Стоимость крафта: </Text>
                      <Text>{results.totalCraftingCost.toFixed(0)} серебра</Text>
                    </Col>
                  </Row>

                  <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col span={12}>
                      <Text strong>Общие затраты: </Text>
                      <Text type="warning">{results.totalCost.toFixed(0)} серебра</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Выручка от продажи: </Text>
                      <Text type="success">{results.totalRevenue.toFixed(0)} серебра</Text>
                    </Col>
                  </Row>

                  {results.totalRevenue > 0 && (
                    <Alert
                      style={{ marginTop: 8 }}
                      message={
                        results.profit >= 0
                          ? `Прибыль: ${results.profit.toFixed(0)} серебра (маржа ${results.profitMargin}%)`
                          : `Убыток: ${Math.abs(results.profit).toFixed(0)} серебра`
                      }
                      type={results.profit >= 0 ? 'success' : 'error'}
                      showIcon
                    />
                  )}

                  <Alert
                    style={{ marginTop: 8 }}
                    message={`Себестоимость одного зелья: ${results.costPerPotion.toFixed(2)} серебра`}
                    type="info"
                    showIcon
                  />

                  <Divider orientation="left">Остатки</Divider>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Основная трава: </Text>
                      <Text>{results.primaryRemaining}</Text>
                    </Col>
                    {results.recipe.secondaryTier && (
                      <Col span={12}>
                        <Text strong>Вспомогательная: </Text>
                        <Text>{results.secondaryRemaining}</Text>
                      </Col>
                    )}
                  </Row>
                </Space>
              </Card>
            )}

            <Card
              title="Справочник трав и рецептов"
              size="small"
              style={{ marginTop: results ? 16 : 0 }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>Травы по тирам:</Text>
                {Object.entries(HERBS).map(([tier, name]) => (
                  <Row key={tier} justify="space-between">
                    <Col>
                      <Tag>{tier}</Tag>
                      <Text type="secondary">{name}</Text>
                    </Col>
                  </Row>
                ))}

                <Divider style={{ margin: '12px 0' }} />

                <Text strong>Рецепты {POTION_TYPES[selectedType]?.emoji} {POTION_TYPES[selectedType]?.name}:</Text>
                {Object.entries(POTION_TYPES[selectedType]?.tiers || {}).map(([tier, recipe]) => (
                  <Text key={tier} type="secondary">
                    {tier}: {recipe.primaryAmount}x {HERBS[tier]}
                    {recipe.secondaryTier && ` + ${recipe.secondaryAmount}x ${HERBS[recipe.secondaryTier]}`}
                    {' '}→ {recipe.outputAmount} зелье
                  </Text>
                ))}

                <Divider style={{ margin: '12px 0' }} />

                <Text strong>Советы:</Text>
                <Text type="secondary">• Крафтите на гильдейском острове — минимальный налог</Text>
                <Text type="secondary">• Используйте Crafting Focus для увеличения возврата трав</Text>
                <Text type="secondary">• Зелья T4+ наиболее востребованы на рынке</Text>
                <Text type="secondary">• Покупайте травы в Мертвых зонах — значительно дешевле</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PotionCraftingCalculator;

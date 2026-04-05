import React, { useState, useEffect } from 'react';
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
  Table,
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

// Все рецепты взяты с wiki.albiononline.com / albiondatabase.com
// outputAmount — количество зелий за 1 крафт (всегда 5)
// ingredients[].amount — сколько единиц ингредиента нужно за 1 крафт
const POTIONS = {
  MINOR_HEALING: {
    key: 'MINOR_HEALING',
    name: 'Minor Healing Potion',
    ruName: 'Малое зелье лечения',
    tier: 'T2',
    group: 'healing',
    emoji: '❤️',
    color: '#ff4d4f',
    outputAmount: 5,
    ingredients: [
      { id: 'arcane_agaric', name: 'Arcane Agaric', ruName: 'Мухомор чародея', amount: 8 },
    ],
  },
  HEALING: {
    key: 'HEALING',
    name: 'Healing Potion',
    ruName: 'Зелье лечения',
    tier: 'T4',
    group: 'healing',
    emoji: '❤️',
    color: '#ff4d4f',
    outputAmount: 5,
    ingredients: [
      { id: 'crenellated_burdock', name: 'Crenellated Burdock', ruName: 'Зубчатый лопух', amount: 24 },
      { id: 'hen_eggs', name: 'Hen Eggs', ruName: 'Куриные яйца', amount: 6 },
    ],
  },
  MAJOR_HEALING: {
    key: 'MAJOR_HEALING',
    name: 'Major Healing Potion',
    ruName: 'Большое зелье лечения',
    tier: 'T6',
    group: 'healing',
    emoji: '❤️',
    color: '#ff4d4f',
    outputAmount: 5,
    ingredients: [
      { id: 'elusive_foxglove', name: 'Elusive Foxglove', ruName: 'Ускользающая наперстянка', amount: 72 },
      { id: 'goose_eggs', name: 'Goose Eggs', ruName: 'Гусиные яйца', amount: 18 },
      { id: 'potato_schnapps', name: 'Potato Schnapps', ruName: 'Картофельный самогон', amount: 18 },
    ],
  },

  MINOR_ENERGY: {
    key: 'MINOR_ENERGY',
    name: 'Minor Energy Potion',
    ruName: 'Малое зелье энергии',
    tier: 'T2',
    group: 'energy',
    emoji: '⚡',
    color: '#faad14',
    outputAmount: 5,
    ingredients: [
      { id: 'arcane_agaric', name: 'Arcane Agaric', ruName: 'Мухомор чародея', amount: 8 },
    ],
  },
  ENERGY: {
    key: 'ENERGY',
    name: 'Energy Potion',
    ruName: 'Зелье энергии',
    tier: 'T4',
    group: 'energy',
    emoji: '⚡',
    color: '#faad14',
    outputAmount: 5,
    ingredients: [
      { id: 'crenellated_burdock', name: 'Crenellated Burdock', ruName: 'Зубчатый лопух', amount: 24 },
      { id: 'goats_milk', name: "Goat's Milk", ruName: 'Козье молоко', amount: 6 },
    ],
  },
  MAJOR_ENERGY: {
    key: 'MAJOR_ENERGY',
    name: 'Major Energy Potion',
    ruName: 'Большое зелье энергии',
    tier: 'T6',
    group: 'energy',
    emoji: '⚡',
    color: '#faad14',
    outputAmount: 5,
    ingredients: [
      { id: 'elusive_foxglove', name: 'Elusive Foxglove', ruName: 'Ускользающая наперстянка', amount: 72 },
      { id: 'sheeps_milk', name: "Sheep's Milk", ruName: 'Овечье молоко', amount: 18 },
      { id: 'potato_schnapps', name: 'Potato Schnapps', ruName: 'Картофельный самогон', amount: 18 },
    ],
  },

  MINOR_GIGANTIFY: {
    key: 'MINOR_GIGANTIFY',
    name: 'Minor Gigantify Potion',
    ruName: 'Малое зелье гиганта',
    tier: 'T3',
    group: 'gigantify',
    emoji: '💪',
    color: '#52c41a',
    outputAmount: 5,
    ingredients: [
      { id: 'brightleaf_comfrey', name: 'Brightleaf Comfrey', ruName: 'Яркий живокост', amount: 8 },
    ],
  },
  GIGANTIFY: {
    key: 'GIGANTIFY',
    name: 'Gigantify Potion',
    ruName: 'Зелье гиганта',
    tier: 'T5',
    group: 'gigantify',
    emoji: '💪',
    color: '#52c41a',
    outputAmount: 5,
    ingredients: [
      { id: 'dragon_teasel', name: 'Dragon Teasel', ruName: 'Драконья ворсянка', amount: 24 },
      { id: 'crenellated_burdock', name: 'Crenellated Burdock', ruName: 'Зубчатый лопух', amount: 12 },
      { id: 'goose_eggs', name: 'Goose Eggs', ruName: 'Гусиные яйца', amount: 6 },
    ],
  },
  MAJOR_GIGANTIFY: {
    key: 'MAJOR_GIGANTIFY',
    name: 'Major Gigantify Potion',
    ruName: 'Большое зелье гиганта',
    tier: 'T7',
    group: 'gigantify',
    emoji: '💪',
    color: '#52c41a',
    outputAmount: 5,
    ingredients: [
      { id: 'firetouched_mullein', name: 'Firetouched Mullein', ruName: 'Огненный коровяк', amount: 72 },
      { id: 'elusive_foxglove', name: 'Elusive Foxglove', ruName: 'Ускользающая наперстянка', amount: 36 },
      { id: 'goose_eggs', name: 'Goose Eggs', ruName: 'Гусиные яйца', amount: 18 },
      { id: 'corn_hooch', name: 'Corn Hooch', ruName: 'Кукурузный самогон', amount: 18 },
    ],
  },

  MINOR_RESISTANCE: {
    key: 'MINOR_RESISTANCE',
    name: 'Minor Resistance Potion',
    ruName: 'Малое зелье защиты',
    tier: 'T3',
    group: 'resistance',
    emoji: '🛡️',
    color: '#1677ff',
    outputAmount: 5,
    ingredients: [
      { id: 'brightleaf_comfrey', name: 'Brightleaf Comfrey', ruName: 'Яркий живокост', amount: 8 },
    ],
  },
  RESISTANCE: {
    key: 'RESISTANCE',
    name: 'Resistance Potion',
    ruName: 'Зелье защиты',
    tier: 'T5',
    group: 'resistance',
    emoji: '🛡️',
    color: '#1677ff',
    outputAmount: 5,
    ingredients: [
      { id: 'dragon_teasel', name: 'Dragon Teasel', ruName: 'Драконья ворсянка', amount: 24 },
      { id: 'crenellated_burdock', name: 'Crenellated Burdock', ruName: 'Зубчатый лопух', amount: 12 },
      { id: 'goats_milk', name: "Goat's Milk", ruName: 'Козье молоко', amount: 6 },
    ],
  },
  MAJOR_RESISTANCE: {
    key: 'MAJOR_RESISTANCE',
    name: 'Major Resistance Potion',
    ruName: 'Большое зелье защиты',
    tier: 'T7',
    group: 'resistance',
    emoji: '🛡️',
    color: '#1677ff',
    outputAmount: 5,
    ingredients: [
      { id: 'firetouched_mullein', name: 'Firetouched Mullein', ruName: 'Огненный коровяк', amount: 72 },
      { id: 'elusive_foxglove', name: 'Elusive Foxglove', ruName: 'Ускользающая наперстянка', amount: 36 },
      { id: 'crenellated_burdock', name: 'Crenellated Burdock', ruName: 'Зубчатый лопух', amount: 36 },
      { id: 'sheeps_milk', name: "Sheep's Milk", ruName: 'Овечье молоко', amount: 18 },
      { id: 'corn_hooch', name: 'Corn Hooch', ruName: 'Кукурузный самогон', amount: 18 },
    ],
  },

  INVISIBILITY: {
    key: 'INVISIBILITY',
    name: 'Invisibility Potion',
    ruName: 'Зелье невидимости',
    tier: 'T8',
    group: 'invisibility',
    emoji: '👻',
    color: '#722ed1',
    outputAmount: 5,
    ingredients: [
      { id: 'ghoul_yarrow', name: 'Ghoul Yarrow', ruName: 'Тысячелистник упыря', amount: 72 },
      { id: 'firetouched_mullein', name: 'Firetouched Mullein', ruName: 'Огнецвет', amount: 36 },
      { id: 'dragon_teasel', name: 'Dragon Teasel', ruName: 'Драконья ворсянка', amount: 36 },
      { id: 'cows_milk', name: "Cow's Milk", ruName: 'Коровье молоко', amount: 18 },
      { id: 'pumpkin_hooch', name: 'Pumpkin Hooch', ruName: 'Тыквенный самогон', amount: 18 },
    ],
  },
};

const GROUP_LABELS = {
  healing: '❤️ Зелья лечения',
  energy: '⚡ Зелья энергии',
  gigantify: '💪 Зелья гиганта',
  resistance: '🛡️ Зелья защиты',
  invisibility: '👻 Зелья невидимости',
};

const getIngredientDefaults = (potion) => {
  const defaults = { returnRate: 15.2, craftingCost: 0 };
  potion.ingredients.forEach((ing) => {
    defaults[`qty_${ing.id}`] = ing.amount * 20;
    defaults[`price_${ing.id}`] = 0;
  });
  return defaults;
};

const PotionCraftingCalculator = () => {
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState('HEALING');
  const [results, setResults] = useState(null);

  const potion = POTIONS[selectedKey];

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(getIngredientDefaults(potion));
    setResults(null);
  }, [selectedKey]);

  const handlePotionChange = (key) => {
    setSelectedKey(key);
  };

  const calculateCrafting = (values) => {
    const { returnRate = 15.2, craftingCost = 0 } = values;
    const returnRateDecimal = returnRate / 100;
    const recipe = potion;

    // Для каждого ингредиента — сколько крафтов можно сделать
    const craftsPerIngredient = recipe.ingredients.map((ing) => {
      const available = values[`qty_${ing.id}`] || 0;
      const effectiveNeeded = ing.amount * (1 - returnRateDecimal);
      return effectiveNeeded > 0 ? Math.floor(available / effectiveNeeded) : Infinity;
    });

    const maxCrafts = Math.min(...craftsPerIngredient);
    const totalPotions = maxCrafts * recipe.outputAmount;

    // Детали по каждому ингредиенту
    const ingredientDetails = recipe.ingredients.map((ing) => {
      const available = values[`qty_${ing.id}`] || 0;
      const effectiveNeeded = ing.amount * (1 - returnRateDecimal);
      const used = maxCrafts * effectiveNeeded;
      const returned = maxCrafts * ing.amount * returnRateDecimal;
      const remaining = available - used;
      const price = values[`price_${ing.id}`] || 0;
      const totalCost = Math.ceil(used) * price;
      return {
        ...ing,
        available,
        used: Math.ceil(used),
        returned: Math.floor(returned),
        remaining: Math.floor(remaining),
        price,
        totalCost,
      };
    });

    const totalIngredientCost = ingredientDetails.reduce((sum, i) => sum + i.totalCost, 0);
    const totalCraftingCost = craftingCost * maxCrafts;
    const totalCost = totalIngredientCost + totalCraftingCost;
    const costPerPotion = totalPotions > 0 ? totalCost / totalPotions : 0;

    setResults({
      maxCrafts,
      totalPotions,
      ingredientDetails,
      totalIngredientCost,
      totalCraftingCost,
      totalCost,
      costPerPotion,
    });
  };

  const groupedOptions = Object.values(
    Object.entries(POTIONS).reduce((acc, [, p]) => {
      if (!acc[p.group]) acc[p.group] = [];
      acc[p.group].push(p);
      return acc;
    }, {})
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Card
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          ⚗️ Калькулятор крафта зелий
        </Title>

        {/* Выбор зелья вынесен наверх */}
        <Card size="small" style={{ marginBottom: 20, background: '#fafafa' }}>
          <Row gutter={[16, 8]} align="middle">
            <Col xs={24} sm={6}>
              <Text strong>Выберите зелье:</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Select
                value={selectedKey}
                onChange={handlePotionChange}
                style={{ width: '100%' }}
                size="large"
              >
                {Object.entries(GROUP_LABELS).map(([group, groupLabel]) => (
                  <Select.OptGroup key={group} label={groupLabel}>
                    {Object.values(POTIONS)
                      .filter((p) => p.group === group)
                      .map((p) => (
                        <Option key={p.key} value={p.key}>
                          <Tag color={p.color} style={{ marginRight: 6 }}>{p.tier}</Tag>
                          {p.ruName}
                        </Option>
                      ))}
                  </Select.OptGroup>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={6}>
              <Space>
                <Tag color={potion.color} style={{ fontSize: 14, padding: '2px 10px' }}>
                  {potion.tier}
                </Tag>
                <Text type="secondary">Выход: <strong>5 шт.</strong> за крафт</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Form
              form={form}
              layout="vertical"
              onFinish={calculateCrafting}
              initialValues={getIngredientDefaults(potion)}
            >
              {/* Ингредиенты */}
              <Card title="🌿 Ингредиенты рецепта" size="small" style={{ marginBottom: 16 }}>
                <Alert
                  style={{ marginBottom: 16 }}
                  type="info"
                  message={
                    <Space wrap>
                      <Text strong>Рецепт ({potion.name}):</Text>
                      {potion.ingredients.map((ing, idx) => (
                        <span key={ing.id}>
                          <Text code>{ing.amount}×</Text>
                          <Text> {ing.ruName}</Text>
                          {idx < potion.ingredients.length - 1 && <Text type="secondary"> + </Text>}
                        </span>
                      ))}
                      <Text type="secondary">→ <strong>5 зелий</strong></Text>
                    </Space>
                  }
                />

                {potion.ingredients.map((ing) => (
                  <Card
                    key={ing.id}
                    size="small"
                    style={{ marginBottom: 12, background: '#f9f9ff', border: '1px solid #e8e8ff' }}
                  >
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>
                      {ing.ruName}
                      <Text type="secondary" style={{ fontWeight: 'normal', marginLeft: 8 }}>
                        ({ing.name}) — нужно <Text code>{ing.amount}</Text> за крафт
                      </Text>
                    </Text>
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item
                          name={`qty_${ing.id}`}
                          label="Количество в наличии"
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={`price_${ing.id}`}
                          label="Цена за единицу"
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} addonAfter="сер." />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Card>

              {/* Прочие параметры */}
              <Card title="⚙️ Параметры крафта" size="small">
                <Form.Item
                  name="returnRate"
                  label="Процент возврата ресурсов (%)"
                  tooltip="Базовый: 15.2%. Растёт с уровнем специализации + Crafting Focus (Premium)"
                >
                  <InputNumber min={0} max={50} step={0.1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="craftingCost"
                  label="Налог станка за 1 крафт"
                  tooltip="Стоимость одного использования Alchemist's Lab (налог острова или города)"
                >
                  <InputNumber min={0} style={{ width: '100%' }} addonAfter="сер." />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
                    Рассчитать
                  </Button>
                </Form.Item>

              </Card>
            </Form>
          </Col>

          <Col xs={24} lg={12}>
            {results ? (
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {/* Итог */}
                <Card size="small">
                  <Alert
                    message={
                      <Text>
                        {potion.emoji} Можно сделать <strong>{results.maxCrafts}</strong> крафтов →{' '}
                        <strong>{results.totalPotions}</strong> зелий{' '}
                        <Tag color={potion.color}>{potion.tier} {potion.ruName}</Tag>
                      </Text>
                    }
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />

                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Всего зелий"
                        value={results.totalPotions}
                        valueStyle={{ color: '#1677ff' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Себестоимость"
                        value={results.costPerPotion.toFixed(2)}
                        suffix="сер./шт."
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                  </Row>
                </Card>

                {/* Детали ингредиентов */}
                <Card title="📦 Расход ингредиентов" size="small">
                  <Table
                    size="small"
                    pagination={false}
                    dataSource={results.ingredientDetails}
                    rowKey="id"
                    columns={[
                      {
                        title: 'Ингредиент',
                        dataIndex: 'ruName',
                        render: (text, row) => (
                          <span>
                            <Text strong>{text}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 11 }}>{row.name}</Text>
                          </span>
                        ),
                      },
                      {
                        title: 'Потрачено',
                        dataIndex: 'used',
                        align: 'center',
                      },
                      {
                        title: 'Возврат',
                        dataIndex: 'returned',
                        align: 'center',
                        render: (v) => <Text type="success">+{v}</Text>,
                      },
                      {
                        title: 'Остаток',
                        dataIndex: 'remaining',
                        align: 'center',
                      },
                      {
                        title: 'Стоимость',
                        dataIndex: 'totalCost',
                        align: 'right',
                        render: (v) => `${v.toFixed(0)} сер.`,
                      },
                    ]}
                  />
                </Card>

                {/* Финансы */}
                <Card title="💰 Финансовый итог" size="small">
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text type="secondary">Ингредиенты:</Text>
                      <br />
                      <Text strong>{results.totalIngredientCost.toFixed(0)} серебра</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Налог крафта:</Text>
                      <br />
                      <Text strong>{results.totalCraftingCost.toFixed(0)} серебра</Text>
                    </Col>
                    <Col span={24} style={{ marginTop: 8 }}>
                      <Text type="secondary">Общие затраты:</Text>
                      <br />
                      <Text strong type="warning">{results.totalCost.toFixed(0)} серебра</Text>
                    </Col>
                  </Row>
                </Card>
              </Space>
            ) : (
              // Справка отображается когда нет результатов
              <Card title="📖 Все рецепты зелий" size="small">
                {Object.entries(GROUP_LABELS).map(([group, groupLabel]) => (
                  <div key={group} style={{ marginBottom: 16 }}>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>{groupLabel}</Text>
                    {Object.values(POTIONS)
                      .filter((p) => p.group === group)
                      .map((p) => (
                        <div key={p.key} style={{ marginBottom: 4, paddingLeft: 12 }}>
                          <Tag color={p.color}>{p.tier}</Tag>
                          <Text type="secondary">
                            {p.ingredients.map((i, idx) => (
                              <span key={i.id}>
                                {i.amount}× {i.ruName}
                                {idx < p.ingredients.length - 1 ? ' + ' : ''}
                              </span>
                            ))}
                            {' '}→ 5 зелий
                          </Text>
                        </div>
                      ))}
                  </div>
                ))}

                <Divider style={{ margin: '12px 0' }} />
                <Text strong>Советы:</Text>
                <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                  <li><Text type="secondary">Крафтите на гильдейском острове — налог минимальный</Text></li>
                  <li><Text type="secondary">Crafting Focus даёт до 45% возврата ингредиентов (Premium)</Text></li>
                  <li><Text type="secondary">Яйца и молоко купить дешевле у фермеров, чем на рынке</Text></li>
                  <li><Text type="secondary">Potato Schnapps и Corn Hooch можно крафтить самому (Cook)</Text></li>
                </ul>
              </Card>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PotionCraftingCalculator;
